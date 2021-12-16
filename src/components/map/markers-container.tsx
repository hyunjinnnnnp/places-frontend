import React from "react";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { PlaceMarkerInfoWindow } from "../../pages/map/place-marker-infowindow";
import { useMyPlaceRelations } from "../../hooks/useMyPlaceRelations";
import { GetMyPlaceRelations_getMyPlaceRelations_relations } from "../../__generated__/GetMyPlaceRelations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MARKER_CLUSTER_MIN } from "../../constants";

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
  categoryImg?: string | null;
  url: string | null;
  kakaoPlaceId: number;
  showMyPlaceRelation: boolean;
  mapLevel: number;
  overlays: kakao.maps.CustomOverlay[];
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
  kakaoPlaceId,
  categoryName,
  categoryImg,
  showMyPlaceRelation,
  mapLevel,
  overlays,
}) => {
  const { data } = useMyPlaceRelations();

  //저장되지 않은 장소일 경우 default emoji
  let markerEmoji = <span>👀</span>;

  if (categoryName && categoryImg) {
    markerEmoji = <span>{categoryImg}</span>;
  }

  //myPlaceRelations에 저장된 장소라면 showMyPlaceRelation상태일 때, 마커를 북마크 이모지로 변경한다
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
      {
        <CustomOverlayMap
          position={position}
          clickable={true}
          xAnchor={0.5}
          yAnchor={0.9}
          onCreate={(customOverlay: kakao.maps.CustomOverlay) => {
            overlays.push(customOverlay);
          }}
        >
          {mapLevel < MARKER_CLUSTER_MIN && (
            <div
              className="bg-yellow-400 w-10 h-10 rounded-full flex justify-center items-center"
              onClick={onClick}
            >
              {markerEmoji}
            </div>
          )}
        </CustomOverlayMap>
      }
      {/* infowindow triggered by click event */}
      {isClicked && mapLevel < MARKER_CLUSTER_MIN && (
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
      {/* place name */}
      {mapLevel < MARKER_CLUSTER_MIN && (
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
