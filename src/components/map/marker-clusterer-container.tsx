import React, { useState } from "react";
import { MapMarker, MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { MARKER_CLUSTER_MIN } from "../../constants";
import {
  GetAllPlacesQuery,
  GetAllPlacesQuery_getAllPlaces_places,
} from "../../__generated__/GetAllPlacesQuery";
import { MarkersContainer } from "./markers-container";

interface IMarkerClustererContainerProps {
  getAllPlacesResult?: GetAllPlacesQuery;
  searchPlacesResult?: kakao.maps.services.PlacesSearchResult;
  mapLevel: number;
  showAllPlaces?: boolean;
  showSearchedPlaces?: boolean;
  showMyPlaceRelation: boolean;
}

export const MarkerClustererContainer: React.FC<IMarkerClustererContainerProps> =
  ({
    getAllPlacesResult,
    searchPlacesResult,
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
                {
                  <>
                    {/* 클러스터러 용 임시 마커 : visible(false)도 안되고 CustomOverlayMap 넣으면 클러스터가 안뜸.... */}
                    <MapMarker
                      key={`${place.lat},${place.lng}`}
                      position={{ lat: place.lat, lng: place.lng }}
                      image={{
                        src: "",
                        size: {
                          width: 0,
                          height: 0,
                        },
                      }}
                    />
                    <MarkersContainer
                      mapLevel={mapLevel}
                      index={index}
                      placeId={place.id}
                      key={`MarkersContainer-${place.lat},${place.lng}`}
                      position={{ lat: place.lat, lng: place.lng }}
                      kakaoPlaceId={place.kakaoPlaceId}
                      name={place.name}
                      address={place.address}
                      phone={place.phone}
                      url={place.url}
                      categoryName={place.category?.name}
                      categoryImg={place.category?.coverImg}
                      onClick={() => {
                        const moveLatLng = new kakao.maps.LatLng(
                          place.lat,
                          place.lng
                        );
                        map?.panTo(moveLatLng);
                        setSelectedMarker(index);
                      }}
                      isClicked={selectedMarker === index}
                      showMyPlaceRelation={showMyPlaceRelation}
                    />
                  </>
                }
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
                {
                  <>
                    {/* 클러스터러 용 임시 마커 : visible(false)도 안되고 CustomOverlayMap 넣으면 클러스터가 안뜸.... */}
                    <MapMarker
                      key={`${item.y},${item.x}`}
                      position={{ lat: +item.y, lng: +item.x }}
                      image={{
                        src: "",
                        size: {
                          width: 0,
                          height: 0,
                        },
                      }}
                    />
                    <MarkersContainer
                      mapLevel={mapLevel}
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
                        const moveLatLng = new kakao.maps.LatLng(
                          +item.y,
                          +item.x
                        );
                        map?.panTo(moveLatLng);
                        setSelectedMarker(index);
                      }}
                      isClicked={selectedMarker === index}
                      showMyPlaceRelation={showMyPlaceRelation}
                    />
                  </>
                }
              </div>
            )
          )}
      </MarkerClusterer>
    );
  };
