import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { authTokenVar, client, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/useMe";

export const MyProfile = () => {
  const { data } = useMe();
  const navigate = useNavigate();
  const logout = async () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    isLoggedInVar(false);
    authTokenVar("");
    navigate("/");
    //FORBIDDEN RESOURCES
  };
  return (
    <>
      {data?.myProfile.user && (
        <div>
          <div className="text-lg font-semibold">
            nickname
            <span className="ml-2 font-normal text-base">
              {data.myProfile.user.nickname}
            </span>
          </div>
          <div className="text-lg font-semibold">
            email
            <span className="ml-2 font-normal text-base">
              {data.myProfile.user.email}
            </span>
          </div>
          <div className="text-lg font-semibold">
            followers
            <span className="ml-2 font-normal text-base">
              {data.myProfile.followersCount}
            </span>
          </div>
          <div className="text-lg font-semibold">
            following
            <span className="ml-2 font-normal text-base">
              {data.myProfile.followingCount}
            </span>
          </div>
          <div className="text-lg font-semibold">
            places
            <span className="ml-2 font-normal text-base">
              {data.myProfile.relationsCount}
            </span>
          </div>
        </div>
      )}
      <button
        onClick={() => {
          logout().then(() => client.resetStore());
        }}
      >
        Log Out
      </button>
      <Link to="/edit-profile">Edit Profile</Link>
    </>
  );
};
