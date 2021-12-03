import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {data && !data?.myProfile.user?.verified && (
        <div className="p-3 bg-red-500 text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="bg-yellow-400 w-full h-14 flex items-center justify-between">
        <Link to="">
          <div className="font-bold text-lg">PLACES</div>
        </Link>
        {data && (
          <>
            <Link to="/my-profile">
              {data.myProfile.user?.avatarUrl && (
                <img
                  className="avatar"
                  src={data.myProfile.user?.avatarUrl}
                  alt="img"
                />
              )}
              {data.myProfile.user?.nickname && (
                <span>{data.myProfile.user?.nickname}</span>
              )}
            </Link>
          </>
        )}
        {!data && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/create-account">Create Account</Link>
          </>
        )}
      </header>
      <Outlet />
    </>
  );
};
