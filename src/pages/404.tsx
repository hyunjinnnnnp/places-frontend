import React from "react";
import { LinkTo } from "../components/link";

export const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <h3 className="font-semibold text-2xl mb-3">Page Not Found</h3>
    <h5 className="font-medium text-base mb-5">
      The page you're looking for does not exist or has moved.
    </h5>
    <LinkTo path={"/"} text={"Click to go back home"} />
  </div>
);
