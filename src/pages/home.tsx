import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { DEFAULT_MAP_COORDS, DEFAULT_MAP_LEVEL } from "../constants";
import {
  GetMyPlaceRelations,
  GetMyPlaceRelations_getMyPlaceRelations,
} from "../__generated__/GetMyPlaceRelations";
import { GET_MY_PLACE_RELATIONS } from "../hooks/useMyPlaceRelations";
import { GetAllPlacesQuery } from "../__generated__/GetAllPlacesQuery";
import { MarkerClustererContainer } from "../components/map/marker-clusterer-container";
import { SearchPlaces } from "./map/search-places";

const GET_ALL_PLACES_QUERY = gql`
  query GetAllPlacesQuery {
    getAllPlaces {
      places {
        kakaoPlaceId
        name
        address
        lat
        lng
        phone
        url
        # category
      }
    }
  }
`;

export const Home = () => {
  const [coords, setCoords] = useState(DEFAULT_MAP_COORDS);
  useState<kakao.maps.services.PlacesSearchResultItem>();
  const [errorMessage, setErrorMessage] = useState<GeolocationPositionError>();
  const [mapLoading, setMapLoading] = useState(true);

  const [mapLevel, setMapLevel] = useState<Number>(DEFAULT_MAP_LEVEL);
  const [searchPlacesResult, setSearchPlacesResult] =
    useState<kakao.maps.services.PlacesSearchResult>();
  const [map, setMap] = useState<kakao.maps.Map>();

  const onGeoSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ lat: latitude, lng: longitude });
    setMapLoading(false);
  };
  const onGeoError = (error: GeolocationPositionError) => {
    console.warn(`ERROR(${error.code}): ${error.message}`);
    alert("Sorry, no position available.");
    return setErrorMessage(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
      enableHighAccuracy: true,
    });
  }, []);

  const { data: getAllPlacesResult } =
    useQuery<GetAllPlacesQuery>(GET_ALL_PLACES_QUERY);

  const [showMyPlaceRelation, setShowMyPlaceRelation] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [
    getMyPlaceRelations,
    { data: getMyPlaceRelationsResult, loading: getMyPlaceRelationsLoading },
  ] = useLazyQuery<GetMyPlaceRelations>(GET_MY_PLACE_RELATIONS);

  return (
    <>
      <SearchPlaces
        map={map && map}
        setSearchPlacesResult={setSearchPlacesResult}
      />
      <button
        onClick={() => {
          setShowPlaces(!showPlaces);
        }}
      >
        {showPlaces ? (
          <FontAwesomeIcon icon={faEye} />
        ) : (
          <FontAwesomeIcon icon={faEyeSlash} />
        )}
      </button>
      <button
        onClick={() => {
          if (!showMyPlaceRelation) {
            getMyPlaceRelations();
          }
          setShowMyPlaceRelation(!showMyPlaceRelation);
        }}
      >
        {showMyPlaceRelation ? (
          <FontAwesomeIcon
            icon={fasBookmark}
            className="cursor-pointer text-yellow-400"
          />
        ) : (
          <FontAwesomeIcon icon={farBookmark} className="cursor-pointer" />
        )}
      </button>
      <Map
        onCreate={setMap}
        center={coords}
        level={DEFAULT_MAP_LEVEL}
        style={{ width: "100%", height: "80vh" }}
        onZoomChanged={(map) => {
          setMapLevel(map.getLevel());
        }}
      >
        {searchPlacesResult && (
          <MarkerClustererContainer
            searchPlacesResult={searchPlacesResult}
            mapLevel={mapLevel}
            showPlaces={showPlaces}
          />
        )}
        {/* 겹치는 게 있다면 제어해야함 마커 두개씩 생김 ㅠㅠ */}
        {getAllPlacesResult && (
          <MarkerClustererContainer
            getAllPlacesResult={getAllPlacesResult}
            mapLevel={mapLevel}
            showPlaces={showPlaces}
          />
        )}
        {/* MY LOCATION */}
        {!mapLoading && (
          <CustomOverlayMap position={coords} xAnchor={0.5} yAnchor={0.7}>
            <div className="text-5xl">🧚🏻</div>
          </CustomOverlayMap>
        )}
        {errorMessage && (
          <CustomOverlayMap position={coords}>
            <div className="label bg-coldGray-50 py-4 px-5">
              <span className="center">{errorMessage.message}</span>
            </div>
          </CustomOverlayMap>
        )}
      </Map>
    </>
  );
};
