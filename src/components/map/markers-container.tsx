import React from "react";
import { CustomOverlayMap, MapMarker, useMap } from "react-kakao-maps-sdk";
import { PlaceInfoOverlay } from "./place-info-overlay";

export const MarkersContainer = ({
  onClick,
  isClicked,
  position,
  name,
  address,
  phone,
  url,
  categoryName,
  mapLevel,
}: any) => {
  const map = useMap();
  return (
    <>
      <MapMarker position={position} onClick={onClick} />
      {isClicked && mapLevel < 7 && (
        <CustomOverlayMap
          position={position}
          clickable={true}
          zIndex={1}
          xAnchor={0.5}
          yAnchor={1.1}
        >
          <PlaceInfoOverlay
            name={name}
            categoryName={categoryName}
            address={address}
            phone={phone}
            url={url}
          />
        </CustomOverlayMap>
      )}
      {mapLevel < 7 && (
        <CustomOverlayMap
          className="bg-gray-50 mt-5 rounded-sm px-1"
          position={position}
          key={`content-${position.y},${position.x}`}
        >
          {name}
        </CustomOverlayMap>
      )}
    </>
  );
};
