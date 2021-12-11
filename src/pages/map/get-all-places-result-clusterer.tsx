import React, { useState } from "react";
import { MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { MARKER_CLUSTER_MIN } from "../../constants";
import { MarkersContainer } from "../../components/map/markers-container";
import { GetAllPlaces_getAllPlaces_places } from "../../__generated__/GetAllPlaces";

export const GetAllPlacesResultClusterer = ({
  result,
  mapLevel,
  showPlaces,
}: any) => {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<number>();
  const {
    getAllPlaces: { places },
  } = result;
  return (
    <MarkerClusterer averageCenter={true} minLevel={MARKER_CLUSTER_MIN}>
      {places &&
        showPlaces &&
        places.map((place: GetAllPlaces_getAllPlaces_places, index: number) => (
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
                const moveLatLng = new kakao.maps.LatLng(place.lat, place.lng);
                map?.panTo(moveLatLng);
                setSelectedMarker(index);
              }}
              isClicked={selectedMarker === index}
              mapLevel={mapLevel}
            />
          </div>
        ))}
    </MarkerClusterer>
  );
};
