import React from "react";
import { Link, Outlet } from "react-router-dom";

export const Header = () => (
  <>
    <header>
      <Link to="/login">Login</Link>
      <Link to="/create-account">Create Account</Link>
    </header>
    <Outlet />
  </>
);
