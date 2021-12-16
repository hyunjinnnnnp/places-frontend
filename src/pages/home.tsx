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
import { GET_MY_PLACE_RELATIONS } from "../hooks/useMyPlaceRelations";
import { GetAllPlacesQuery } from "../__generated__/GetAllPlacesQuery";
import { MarkerClustererContainer } from "../components/map/marker-clusterer-container";
import { SearchPlaces } from "./map/search-places";
import { GetMyPlaceRelations } from "../__generated__/GetMyPlaceRelations";

const GET_ALL_PLACES_QUERY = gql`
  query GetAllPlacesQuery {
    getAllPlaces {
      places {
        id
        kakaoPlaceId
        name
        address
        lat
        lng
        phone
        url
        category {
          name
          slug
          coverImg
        }
      }
    }
  }
`;

export const Home = () => {
  const [mapLevel, setMapLevel] = useState<number>(DEFAULT_MAP_LEVEL);
  const [coords, setCoords] = useState(DEFAULT_MAP_COORDS);
  useState<kakao.maps.services.PlacesSearchResultItem>();
  const [errorMessage, setErrorMessage] = useState<GeolocationPositionError>();
  const [mapLoading, setMapLoading] = useState(true);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [showAllPlaces, setShowAllPlaces] = useState(true);
  const [searchPlacesResult, setSearchPlacesResult] =
    useState<kakao.maps.services.PlacesSearchResult>();
  const [showSearchedPlaces, setShowSearchedPlaces] = useState(false);
  const [showMyPlaceRelation, setShowMyPlaceRelation] = useState(false);

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

  const [getMyPlaceRelations, { data: getMyPlaceRelationsResult }] =
    useLazyQuery<GetMyPlaceRelations>(GET_MY_PLACE_RELATIONS);
  //TO DO !! click button ?

  useEffect(() => {
    if (getAllPlacesResult) {
      setShowAllPlaces(true);
      setShowSearchedPlaces(false);
    }
    if (searchPlacesResult) {
      setShowSearchedPlaces(true);
      setShowAllPlaces(false);
    }
    if (getMyPlaceRelationsResult) {
      setShowMyPlaceRelation(true);
    }
  }, [getAllPlacesResult, searchPlacesResult, getMyPlaceRelationsResult]);

  return (
    <>
      <SearchPlaces
        map={map}
        setSearchPlacesResult={setSearchPlacesResult}
        showSearchedPlaces={showSearchedPlaces}
      />
      <button
        onClick={() => {
          setShowAllPlaces(!showAllPlaces);
          setShowSearchedPlaces(!showSearchedPlaces);
        }}
      >
        {showAllPlaces ? (
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
            className="cursor-pointer text-green-400"
          />
        ) : (
          <FontAwesomeIcon
            icon={farBookmark}
            className="cursor-pointer text-green-400"
            onClick={() => getMyPlaceRelations}
          />
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
        {getAllPlacesResult && (
          <MarkerClustererContainer
            getAllPlacesResult={getAllPlacesResult}
            mapLevel={mapLevel}
            showAllPlaces={showAllPlaces}
            showMyPlaceRelation={showMyPlaceRelation}
          />
        )}
        {searchPlacesResult && (
          <MarkerClustererContainer
            searchPlacesResult={searchPlacesResult}
            mapLevel={mapLevel}
            showSearchedPlaces={showSearchedPlaces}
            showMyPlaceRelation={showMyPlaceRelation}
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
