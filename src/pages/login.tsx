import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
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
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: { email, password },
    });
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
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};
