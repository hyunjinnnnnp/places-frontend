import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { useNavigate } from "react-router-dom";
import { LinkTo } from "../components/link";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const navigate = useNavigate();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      navigate("/");
    }
    console.log(error);
    //TO DO : error handling
  };
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
  });
  const [preview, setPreview] = useState("");
  const [currentPassword, setcurrentPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  watch(["file", "password"]);
  useEffect(() => {
    watch(({ file, password }) => {
      setcurrentPassword(password);
      if (file.length > 0) {
        const reader = new FileReader();
        const actualFile = file[0];
        reader.readAsDataURL(actualFile);
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
      }
    });
  }, [watch]);

  const [createAccount, { data: createAccountMutationResult, loading }] =
    useMutation<createAccountMutation, createAccountMutationVariables>(
      CREATE_ACCOUNT_MUTATION,
      {
        onCompleted,
      }
    );
  const onSubmit = async () => {
    const { nickname, email, password, file } = getValues();
    try {
      if (file.length > 0) {
        const actualFile = file[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        const { url: avatarUrl } = await (
          await fetch("http://localhost:4000/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        setAvatarUrl(avatarUrl);
      }
      createAccount({
        variables: {
          createAccountInput: {
            nickname,
            email,
            password,
            avatarUrl,
          },
        },
      });
    } catch (e) {
      //TO DO : error handling
    }
  };

  return (
    <div className="h-screen flex items-center flex-col justify-center">
      <HelmetProvider>
        <Helmet>
          <title>Create Account | Places</title>
        </Helmet>
      </HelmetProvider>
      <div className="w-full max-w-screen-sm">
        <h4 className="w-full font-medium text-center text-3xl mb-5 lg:mb-10">
          Let's get started!
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 my-5 w-full px-10"
        >
          {preview && <img src={preview} alt="img-preview" />}
          <input
            {...register("file")}
            accept="image/*"
            type="file"
            name="file"
          />
          <input
            className="input"
            {...register("nickname", {
              required: "Nickname is required",
            })}
            placeholder="Nickname"
            name="nickname"
            type="text"
          />
          {errors.nickname?.message}
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
          <input
            className="input"
            {...register("checkPassword", {
              required: "Password confirm field is required.",
              validate: (value) => value === currentPassword,
            })}
            placeholder="Check Password"
            name="checkPassword"
            type="password"
          />
          {errors.checkPassword?.message && (
            <FormError errorMessage={errors.checkPassword?.message} />
          )}
          {errors.checkPassword && errors.checkPassword.type === "validate" && (
            <FormError errorMessage="The passwords do not match." />
          )}
          <Button canClick={isValid} loading={loading} actionText={"Create"} />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?
          <LinkTo path={"/login"} text={"Log in now"} />
        </div>
      </div>
    </div>
  );
};
