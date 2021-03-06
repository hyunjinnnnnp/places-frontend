import { useMutation, gql } from "@apollo/client";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { LinkTo } from "../components/link";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { LoginInput } from "../__generated__/globalTypes";
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

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<LoginInput>({
    mode: "onChange",
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      navigate("/");
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
      <HelmetProvider>
        <Helmet>
          <title>Login | Places</title>
        </Helmet>
      </HelmetProvider>
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
                  //eslint-disable-next-line
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
          <LinkTo path="/create-account" text="Create an Account" />
        </div>
      </div>
    </div>
  );
};
