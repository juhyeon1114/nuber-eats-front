import React from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, error, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const onError = (error: ApolloError) => {};
  const [login, { loading, error, data: loginResult }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted, onError });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      login({
        variables: { loginInput: { email, password } },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-3xl text-gray-800">Nuber Eats</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            ref={register({ required: "Email is required" })}
            type="email"
            name="email"
            placeholder="email"
            required
            className="input"
          />
          {errors.email?.message && <FormError msg={errors.email?.message} />}
          <input
            ref={register({ required: "Password is required" })}
            type="password"
            name="password"
            placeholder="password"
            required
            className="input"
          />
          {errors.password?.message && (
            <FormError msg={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError msg="Password must be longer than 10 chars" />
          )}
          <button type="submit" className="btn">
            {loading ? "loading..." : "로그인"}
          </button>
          {loginResult?.login.error && (
            <FormError msg={loginResult?.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
