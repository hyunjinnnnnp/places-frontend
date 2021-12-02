import React from "react";
import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { myProfile } from "../__generated__/myProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../components/header";

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
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-lg tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Routes>
        {/* <button onClick={() => isLoggedInVar(false)}>Log Out</button> */}
      </Routes>
    </Router>
  );
};
