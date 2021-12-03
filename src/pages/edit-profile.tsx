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

export const EditProfile = () => {
  const { data: userData } = useMe();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      //update cache. verified =false;
      console.log(ok);
    }
  };
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [actualFile, setActualFile] = useState<Blob | string>("");
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

  const fetchAPI = async (formBody: FormData) => {
    const { url } = await (
      await fetch("http://localhost:4000/uploads/", {
        method: "POST",
        body: formBody,
      })
    ).json();
    setAvatarUrl(url);
  };

  const file = watch("file");
  useEffect(() => {
    if (file && file.length > 0) {
      //file이 있다면 프리뷰 이미지
      const reader = new FileReader();
      setActualFile(file[0]);
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
      const formBody = new FormData();
      formBody.append("file", actualFile);
      await fetchAPI(formBody);
      const { nickname, email } = getValues();
      editProfile({
        variables: {
          input: {
            ...(nickname !== userData?.myProfile.user?.nickname && {
              nickname,
            }),
            ...(email !== userData?.myProfile.user?.email && { email }),
            ...(avatarUrl && { avatarUrl }),
          },
        },
      });
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
        {/* //TO DO: check if the nickname exists  */}
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
