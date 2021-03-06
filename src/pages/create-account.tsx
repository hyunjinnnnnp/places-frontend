import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { useNavigate } from "react-router-dom";
import { LinkTo } from "../components/link";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from "../__generated__/CreateAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutation) => {
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

  const fetchAPI = async (formBody: FormData) => {
    const { url } = await (
      await fetch("http://localhost:4000/uploads/", {
        method: "POST",
        body: formBody,
      })
    ).json();
    setAvatarUrl(url);
  };

  watch(["file", "password"]);
  useEffect(() => {
    watch(({ file, password }) => {
      setcurrentPassword(password);
      if (file.length > 0) {
        //file이 있다면 프리뷰 이미지
        const reader = new FileReader();
        const actualFile = file[0];
        reader.readAsDataURL(actualFile);
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        //fetch API >>> onSubmit으로 옮겨야함
        const formBody = new FormData();
        formBody.append("file", actualFile);
        fetchAPI(formBody);
      }
    });
  }, [watch]);

  const [createAccount, { data: createAccountMutationResult, loading }] =
    useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
      CREATE_ACCOUNT_MUTATION,
      {
        onCompleted,
      }
    );

  const onSubmit = async () => {
    //아바타가 있던 없던 가입은 성공해야함
    try {
      const { nickname, email, password } = getValues();
      //아바타가 있다면 업로드한다

      //없으면 그냥 쿼리 날린다
      createAccount({
        variables: {
          createAccountInput: {
            nickname,
            email,
            password,
            ...(avatarUrl && { avatarUrl }),
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
