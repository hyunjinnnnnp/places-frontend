import React from "react";
import { Link } from "react-router-dom";

interface ILinkProps {
  path: string;
  text: string;
}
export const LinkTo: React.FC<ILinkProps> = ({ path, text }) => (
  <Link to={path} className="text-yellow-500 hover:underline">
    {text}
  </Link>
);
