import React, { useState } from "react";
import { MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { MARKER_CLUSTER_MIN } from "../../constants";
import { MarkersContainer } from "../../components/map/markers-container";

export const SearchResultClusterer = ({ result, mapLevel }: any) => {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<number>();

  return (
    <MarkerClusterer averageCenter={true} minLevel={MARKER_CLUSTER_MIN}>
      {result &&
        result.map(
          (item: kakao.maps.services.PlacesSearchResultItem, index: number) => (
            <div key={`container-${item.y},${item.x}`}>
              <MarkersContainer
                index={index}
                key={`MarkersContainer-${item.y},${item.x}`}
                position={{ lat: +item.y, lng: +item.x }}
                kakaoPlaceId={item.id}
                name={item.place_name}
                address={item.address_name}
                phone={item.phone}
                url={item.place_url}
                categoryName={item.category_name}
                onClick={() => {
                  const moveLatLng = new kakao.maps.LatLng(+item.y, +item.x);
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
