import React from "react";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { PlaceMarkerInfoWindow } from "../../pages/map/place-marker-infowindow";
import { useMyPlaceRelations } from "../../hooks/useMyPlaceRelations";
import { GetMyPlaceRelations_getMyPlaceRelations_relations } from "../../__generated__/GetMyPlaceRelations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IMarkersContainerProps {
  onClick: () => void;
  index: number;
  isClicked: boolean;
  position: { lat: number; lng: number };
  placeId?: number;
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
  placeId,
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

  //myPlaceRelations에 저장된 장소라면 마커를 변경한다
  let markerEmoji = <span>🍎</span>;
  if (showMyPlaceRelation && data?.getMyPlaceRelations.relations) {
    data.getMyPlaceRelations.relations.map(
      (relation: GetMyPlaceRelations_getMyPlaceRelations_relations) => {
        if (relation.kakaoPlaceId === kakaoPlaceId) {
          markerEmoji = (
            <FontAwesomeIcon
              icon={fasBookmark}
              className="cursor-pointer text-green-400"
            />
          );
        }
        return markerEmoji;
      }
    );
  }

  return (
    <>
      {/* Marker with emoji */}
      <CustomOverlayMap
        position={position}
        clickable={true}
        xAnchor={0.5}
        yAnchor={1.1}
      >
        <div
          className="bg-yellow-400 w-10 h-10 rounded-full flex justify-center items-center"
          onClick={onClick}
        >
          {markerEmoji}
        </div>
      </CustomOverlayMap>
      {/* infowindow triggered by click event */}
      {isClicked && mapLevel < 7 && (
        <CustomOverlayMap
          position={position}
          clickable={true}
          zIndex={1}
          xAnchor={0.5}
          yAnchor={1.1}
        >
          <PlaceMarkerInfoWindow
            placeId={placeId}
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
      {/* marker name */}
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
