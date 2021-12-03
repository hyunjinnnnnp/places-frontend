import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../components/header";
import { Home } from "../pages/home";
import { NotFound } from "../pages/404";
import { useMe } from "../hooks/useMe";
import { MyProfile } from "../pages/my-profile";
import { ConfirmEmail } from "../pages/confirm-email";

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
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
        <Route path="" element={<Home />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="confirm/*" element={<ConfirmEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
