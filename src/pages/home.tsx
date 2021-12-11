import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Map, CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import { SearchResultClusterer } from "./map/search-result-clusterer";
import { DEFAULT_MAP_COORDS, DEFAULT_MAP_LEVEL } from "../constants";
import {
  GetMyPlaceRelations,
  GetMyPlaceRelations_getMyPlaceRelations,
} from "../__generated__/GetMyPlaceRelations";
import { GetAllPlaces } from "../__generated__/GetAllPlaces";
import { GetAllPlacesResultClusterer } from "./map/get-all-places-result-clusterer";
import { GET_MY_PLACE_RELATIONS } from "../hooks/useMyPlaceRelations";

const GET_ALL_PLACES = gql`
  query GetAllPlaces {
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
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [mapLevel, setMapLevel] = useState<Number>(DEFAULT_MAP_LEVEL);
  const [searchResult, setSearchResult] =
    useState<kakao.maps.services.PlacesSearchResult>();
  const [map, setMap] = useState<kakao.maps.Map>();

  const onGeoSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ lat: latitude, lng: longitude });
    setLoading(false);
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

  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = () => {
    const keyword = getValues("search");
    setKeyword(keyword);
  };

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();
    if (keyword) {
      ps.keywordSearch(
        keyword,
        (
          data: kakao.maps.services.PlacesSearchResult,
          status: kakao.maps.services.Status
        ) => {
          if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
            return;
          }
          if (status === kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
            return;
          }
          if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();
            setSearchResult(data);
            data.map((item: kakao.maps.services.PlacesSearchResultItem) => {
              return bounds.extend(new kakao.maps.LatLng(+item.y, +item.x));
            });
            map.setBounds(bounds);
          }
        }
      );
    }
  }, [keyword, map]);

  const [showMyPlaceRelation, setShowMyPlaceRelation] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [myPlaceRelations, setMyPlaceRelations] =
    useState<GetMyPlaceRelations_getMyPlaceRelations>();
  //get all places
  const { data: getAllPlacesResult } = useQuery<GetAllPlaces>(GET_ALL_PLACES);

  //then if click the bookmark btn, show my relations with the icon
  const [
    getMyPlaceRelations,
    { data: getMyPlaceRelationsResult, loading: getMyPlaceRelationsLoading },
  ] = useLazyQuery<GetMyPlaceRelations>(GET_MY_PLACE_RELATIONS);
  if (
    getMyPlaceRelationsResult &&
    getMyPlaceRelationsResult.getMyPlaceRelations
  ) {
    console.log(getMyPlaceRelationsResult.getMyPlaceRelations);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("search")} placeholder="search" />
        <button>submit</button>
      </form>
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
        {searchResult && (
          <SearchResultClusterer result={searchResult} mapLevel={mapLevel} />
        )}
        {getAllPlacesResult && (
          <GetAllPlacesResultClusterer
            showPlaces={showPlaces}
            result={getAllPlacesResult}
            mapLevel={mapLevel}
            getMyPlaceRelationsResult={getMyPlaceRelationsResult}
          />
        )}
        {!loading && (
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
