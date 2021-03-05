import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};

/**
 * 이 Hook을 여러 컴포넌트에서 가져다 써도, Query는 1번만 날림
 * Query가 caching되어 있는지 apollo가 판단하고, caching된 것이 있으면 그것을 return 해줌
 */
