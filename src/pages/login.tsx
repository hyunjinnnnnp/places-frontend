import { useMutation, gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<ILoginForm>({
    mode: "onChange",
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: { loginInput: { email, password } },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col justify-center">
      <div className="w-full max-w-screen-sm">
        <h4 className="w-full font-medium text-center text-3xl mb-5 lg:mb-10">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 my-5 w-full px-10"
        >
          <input
            className="input"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter your email. (example@places.com)",
              },
            })}
            placeholder="Email"
            name="email"
            type="email"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            className="input"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 10,
                message: "Password must be more than 10 chars.",
              },
            })}
            placeholder="Password"
            name="password"
            type="password"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button canClick={isValid} loading={loading} actionText={"Log In"} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div className="px-10 text-right">
          New to Places?
          <Link
            to="/create-account"
            className="text-yellow-600 hover:underline ml-2"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
