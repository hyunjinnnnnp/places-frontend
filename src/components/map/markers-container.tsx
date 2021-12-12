import markerSolid from "../../images/map-marker-solid.svg";
import markerPin from "../../images/66990_marker_icon.png";
import React from "react";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import { PlaceMarkerInfoWindow } from "../../pages/map/place-marker-infowindow";
import { useMyPlaceRelations } from "../../hooks/useMyPlaceRelations";
import { GetMyPlaceRelations_getMyPlaceRelations_relations } from "../../__generated__/GetMyPlaceRelations";

interface IMarkersContainerProps {
  onClick: () => void;
  index: number;
  isClicked: boolean;
  position: { lat: number; lng: number };
  name: string;
  address: string;
  phone: string | null;
  categoryName?: string;
  url: string | null;
  mapLevel: number;
  kakaoPlaceId: number;
  showMyPlaceRelation: boolean;
}

export const MarkersContainer: React.FC<IMarkersContainerProps> = ({
  onClick,
  isClicked,
  position,
  name,
  address,
  phone,
  url,
  mapLevel,
  kakaoPlaceId,
  categoryName,
  showMyPlaceRelation,
}) => {
  const { data } = useMyPlaceRelations();

  let imgSrc = markerSolid;
  if (showMyPlaceRelation && data && data.getMyPlaceRelations.relations) {
    data.getMyPlaceRelations.relations.map(
      (item: GetMyPlaceRelations_getMyPlaceRelations_relations) => {
        if (+item.kakaoPlaceId === kakaoPlaceId) {
          const src = markerPin;
          imgSrc = src;
        }
        return imgSrc;
      }
    );
  }

  return (
    <>
      <MapMarker
        position={position}
        onClick={onClick}
        image={{
          src: imgSrc,
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
          key={`content-${position.lat},${position.lng}`}
        >
          {name}
        </CustomOverlayMap>
      )}
    </>
  );
};
