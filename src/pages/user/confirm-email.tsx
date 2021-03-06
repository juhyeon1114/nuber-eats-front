import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmailVariables,
  verifyEmail,
} from "../../__generated__/verifyEmail";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData, refetch } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = async (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      // await refetch();
      client.writeFragment({
        /**
         * writeFragment : 캐시에 있는 특정 타입의 일부만 수정하고 싶을 때 사용
         * id : 수정하고싶은 타입의 고유id (default: id)
         * fragment : 특정 타입중, 수정하고 싶은 부분
         * data: 어떤 값으로 변경할지
         */
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: { code: code || "" },
      },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Confirm Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-2 font-medium">이메일 확인중...</h2>
      <h4 className="text-gray-700 text-sm">
        이 페이지를 닫지 말고, 잠시만 기다려주세요
      </h4>
    </div>
  );
};
