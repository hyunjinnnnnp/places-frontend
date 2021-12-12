import React, { useState } from "react";
import { MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { MarkersContainer } from "../../components/map/markers-container";
import { MARKER_CLUSTER_MIN } from "../../constants";
import {
  GetAllPlacesQuery,
  GetAllPlacesQuery_getAllPlaces_places,
} from "../../__generated__/GetAllPlacesQuery";

interface IGetAllPlacesProps {
  getAllPlacesResult: GetAllPlacesQuery;
  mapLevel: Number;
  showPlaces: boolean;
}

//place.lat lng || place.x y
//만약 result 타입이 from kakao API? place.lat lng === place.y x
export const GetAllPlaces: React.FC<IGetAllPlacesProps> = ({
  getAllPlacesResult,
  mapLevel,
  showPlaces,
}) => {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<number>();

  return (
    <MarkerClusterer averageCenter={true} minLevel={MARKER_CLUSTER_MIN}>
      {getAllPlacesResult.getAllPlaces.places &&
        showPlaces &&
        getAllPlacesResult.getAllPlaces.places.map(
          (place: GetAllPlacesQuery_getAllPlaces_places, index: number) => (
            <div key={`container-${place.lat},${place.lng}`}>
              <MarkersContainer
                index={index}
                key={`MarkersContainer-${place.lat},${place.lng}`}
                position={{ lat: place.lat, lng: place.lng }}
                kakaoPlaceId={place.kakaoPlaceId}
                name={place.name}
                address={place.address}
                phone={place.phone}
                url={place.url}
                //   getMyPlaceRelationsResult={getMyPlaceRelationsResult}
                // categoryName={place.category_name}
                onClick={() => {
                  const moveLatLng = new kakao.maps.LatLng(
                    place.lat,
                    place.lng
                  );
                  map?.panTo(moveLatLng);
                  setSelectedMarker(index);
                }}
                isClicked={selectedMarker === index}
                mapLevel={mapLevel}
              />
            </div>
          )
        )}
    </MarkerClusterer>
  );
};
