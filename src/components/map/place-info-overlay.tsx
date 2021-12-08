import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import React from "react";

export const PlaceInfoOverlay = ({
  name,
  address,
  phone,
  url,
  categoryName,
}: any) => {
  return (
    <div className="flex flex-col bg-gray-900 p-2 text-gray-100">
      <div className="flex justify-between">
        <span className="text-lg font-semibold pb-2">{name}</span>
        <FontAwesomeIcon icon={farBookmark} className="cursor-pointer" />
      </div>
      <span>{categoryName}</span>
      <span>{address}</span>
      <span>{phone}</span>
      <a
        className="text-right cursor-pointer mt-2"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        새 창에서 상세 보기
      </a>
    </div>
  );
};
