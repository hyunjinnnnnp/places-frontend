import markerSolid from "../../images/map-marker-solid.svg";
import pin from "../../images/66990_marker_icon.png";
import React from "react";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import { PlaceMarkerInfoWindow } from "../../pages/map/place-marker-infowindow";
import { useMyPlaceRelations } from "../../hooks/useMyPlaceRelations";

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
  kakaoPlaceId,
}: any) => {
  const { data } = useMyPlaceRelations();
  let img = markerSolid;
  if (data && data.getMyPlaceRelations.relations) {
    data.getMyPlaceRelations.relations.map((item) => {
      if (item.kakaoPlaceId === kakaoPlaceId) {
        const src = pin;
        img = src;
      }
    });
  }
  return (
    <>
      <MapMarker
        position={position}
        onClick={onClick}
        image={{
          src: img, //if kakaoPlaceId
          size: {
            width: 50,
            height: 50,
          },
        }}
      />
      {isClicked && mapLevel < 7 && (
        <CustomOverlayMap
          position={position}
          clickable={true}
          zIndex={1}
          xAnchor={0.5}
          yAnchor={1.1}
        >
          <PlaceMarkerInfoWindow
            position={position}
            name={name}
            categoryName={categoryName}
            address={address}
            phone={phone}
            url={url}
            kakaoPlaceId={kakaoPlaceId}
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
