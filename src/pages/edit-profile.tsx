import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMe } from "../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../__generated__/editProfile";
import { Button } from "../components/button";
import { client } from "../apollo";
import { useNavigate } from "react-router-dom";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  nickname?: string;
  file?: File[];
  password?: string;
}
let avatarUrl: string;

export const EditProfile = () => {
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const { data: userData } = useMe();

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok, error },
    } = data;
    if (ok && userData?.myProfile.user) {
      //update cache. if email changed, verified false;
      const {
        myProfile: {
          user: { id, email: prevEmail, avatarUrl: prevAvatarUrl },
        },
      } = userData;

      const { email: newEmail, nickname } = getValues();
      client.writeFragment({
        id: `User:${id}`,
        fragment: gql`
          fragment edited on User {
            verified
            email
            nickname
            avatarUrl
          }
        `, //newAvatarUrl 이 있다면 newAvatarUrl
        data: {
          email: newEmail,
          verified: newEmail === prevEmail,
          nickname,
          avatarUrl: avatarUrl !== "" ? avatarUrl : prevAvatarUrl,
        },
      });
    }
    console.log(ok);
    navigate("/my-profile");
  };

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.myProfile.user?.email,
      nickname: userData?.myProfile.user?.nickname,
    },
    mode: "onChange",
  });

  const file = watch("file");
  useEffect(() => {
    if (file && file.length > 0) {
      //file이 있다면 프리뷰 이미지
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  }, [file]);

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  const onSubmit = async () => {
    try {
      //fetch API then edit
      const { file, nickname, email } = getValues();
      if (file && file.length > 0) {
        const actualFile = file[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        const { url } = await (
          await fetch("http://localhost:4000/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        // setAvatarUrl(url);
        avatarUrl = await url;
        editProfile({
          variables: {
            //data !== prevData는 백엔드에서 확인하고있음.
            input: {
              nickname,
              email,
              avatarUrl: url && url,
            },
          },
        });
      } else {
        editProfile({
          variables: {
            input: {
              nickname,
              email,
            },
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>EditProfile</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {preview && <img src={preview} alt="img-preview" />}
        <input {...register("file")} type="file" accept="image/*" />
        <input
          className="input"
          {...register("nickname")}
          type="text"
          placeholder="nickname"
        />
        <input
          className="input"
          {...register("email", {
            pattern: {
              value:
                //eslint-disable-next-line
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please enter your email. (example@places.com)",
            },
          })}
          type="email"
          placeholder="email"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email.message} />
        )}
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </>
  );
};
