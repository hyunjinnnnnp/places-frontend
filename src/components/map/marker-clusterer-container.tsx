import React, { useState } from "react";
import { MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { MARKER_CLUSTER_MIN } from "../../constants";
import {
  GetAllPlacesQuery,
  GetAllPlacesQuery_getAllPlaces_places,
} from "../../__generated__/GetAllPlacesQuery";
import { GetMyPlaceRelations } from "../../__generated__/GetMyPlaceRelations";
import { MarkersContainer } from "./markers-container";

interface IMarkerClustererContainerProps {
  getAllPlacesResult?: GetAllPlacesQuery;
  searchPlacesResult?: kakao.maps.services.PlacesSearchResult;
  getMyPlaceRelationsResult?: GetMyPlaceRelations;
  mapLevel: number;
  showAllPlaces?: boolean;
  showSearchedPlaces?: boolean;
  showMyPlaceRelation: boolean;
}

export const MarkerClustererContainer: React.FC<IMarkerClustererContainerProps> =
  ({
    getAllPlacesResult,
    searchPlacesResult,
    getMyPlaceRelationsResult,
    mapLevel,
    showAllPlaces,
    showSearchedPlaces,
    showMyPlaceRelation,
  }) => {
    const map = useMap();
    const [selectedMarker, setSelectedMarker] = useState<number>();
    return (
      <MarkerClusterer averageCenter={true} minLevel={MARKER_CLUSTER_MIN}>
        {getAllPlacesResult?.getAllPlaces.places &&
          showAllPlaces &&
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
                  showMyPlaceRelation={showMyPlaceRelation}
                />
              </div>
            )
          )}
        {searchPlacesResult &&
          showSearchedPlaces &&
          searchPlacesResult.map(
            (
              item: kakao.maps.services.PlacesSearchResultItem,
              index: number
            ) => (
              <div key={`container-${item.y},${item.x}`}>
                <MarkersContainer
                  index={index}
                  key={`MarkersContainer-${item.y},${item.x}`}
                  position={{ lat: +item.y, lng: +item.x }}
                  kakaoPlaceId={+item.id}
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
                  showMyPlaceRelation={showMyPlaceRelation}
                />
              </div>
            )
          )}
      </MarkerClusterer>
    );
  };
