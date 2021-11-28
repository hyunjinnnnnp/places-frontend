import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}
export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={`py-4 text-lg font-medium text-white transition-colors ${
      canClick ? "bg-yellow-500" : "bg-gray-300"
    }`}
    type="submit"
  >
    {loading ? "Loading..." : actionText}
  </button>
);
