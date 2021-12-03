import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../__generated__/verifyEmail";
import { useQueryParams } from "../hooks/useQueryParams";
import { client } from "../apollo";
import { useMe } from "../hooks/useMe";
import { useNavigate } from "react-router";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;
export const ConfirmEmail = () => {
  const navigate = useNavigate();
  const { data: userData } = useMe();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.myProfile.user) {
      client.writeFragment({
        id: `User:${userData?.myProfile.user.id}`,
        fragment: gql`
          fragment verifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      navigate("/");
    }
  };
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );
  const params = useQueryParams();
  const code = params.get("code");
  useEffect(() => {
    if (code) {
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    }
  }, [code]);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Confirming email...</h1>
      <h4 className="text-lg font-light mt-5">
        Please wait, don't close this page
      </h4>
    </div>
  );
};