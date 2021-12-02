import React from "react";
import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { myProfile } from "../__generated__/myProfile";

const MY_PROFILE_QUERY = gql`
  query myProfile {
    myProfile {
      user {
        id
        email
        nickname
        verified
        avatarUrl
      }
      followingCount
      followersCount
      relationsCount
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<myProfile>(MY_PROFILE_QUERY);
  console.log(data, "from frontend");
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-lg tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data.myProfile?.user?.nickname}</h1>
      <button onClick={() => isLoggedInVar(false)}>Log Out</button>
    </div>
  );
};
