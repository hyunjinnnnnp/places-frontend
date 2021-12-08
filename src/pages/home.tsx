import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Map, CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import { MarkerClustererContainer } from "../components/map/marker-clusterer-container";
import { DEFAULT_MAP_COORDS, DEFAULT_MAP_LEVEL } from "../constants";

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

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ lat: latitude, lng: longitude });
    setLoading(false);
  };
  const onError = (error: GeolocationPositionError) => {
    console.warn(`ERROR(${error.code}): ${error.message}`);
    alert("Sorry, no position available.");
    return setErrorMessage(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("search")} placeholder="search" />
        <button>submit</button>
      </form>
      <Map
        onCreate={setMap}
        center={coords}
        level={DEFAULT_MAP_LEVEL}
        style={{ width: "100%", height: "80vh" }}
        onZoomChanged={(map) => {
          setMapLevel(map.getLevel());
        }}
      >
        <MarkerClustererContainer
          searchResult={searchResult}
          mapLevel={mapLevel}
        />
        {!loading && <MapMarker position={coords} />}
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
