import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Map,
  CustomOverlayMap,
  MapMarker,
  MarkerClusterer,
  useMap,
} from "react-kakao-maps-sdk";

export const Home = () => {
  const DEFAULT_MAP_LEVEL = 10;
  const [coords, setCoords] = useState({ lat: 33.55635, lng: 126.795841 });
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

  const Overlay = ({ name, address, phone, url, categoryName }: any) => {
    return (
      <div className="flex flex-col bg-gray-900 p-2 text-gray-100">
        <div className="flex justify-between">
          <span className="text-lg font-semibold pb-2">{name}</span>
          <FontAwesomeIcon icon={farBookmark} className="cursor-pointer" />
        </div>
        <span>{categoryName}</span>
        <span>{address}</span>
        <span>{phone}</span>
        <a
          className="text-right cursor-pointer mt-2"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          새 창에서 상세 보기
        </a>
      </div>
    );
  };

  const EventMarkerContainer = ({
    onClick,
    isClicked,
    position,
    name,
    address,
    phone,
    url,
    categoryName,
  }: any) => {
    const map = useMap();
    return (
      <>
        <MapMarker position={position} onClick={onClick} />
        {isClicked && (
          <CustomOverlayMap
            position={position}
            clickable={true}
            zIndex={1000}
            xAnchor={0.5}
            yAnchor={1}
          >
            <Overlay
              name={name}
              categoryName={categoryName}
              address={address}
              phone={phone}
              url={url}
            />
          </CustomOverlayMap>
        )}
      </>
    );
  };
  const [selectedMarker, setSelectedMarker] = useState<number>();
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
        style={{ width: "100%", height: "360px" }}
        onZoomChanged={(map) => {
          setMapLevel(map.getLevel());
        }}
      >
        <MarkerClusterer averageCenter={true} minLevel={7}>
          {searchResult &&
            searchResult.map((item, index) => (
              <div key={`container-${item.y},${item.x}`}>
                {/* TO DO : component 분리 */}
                <EventMarkerContainer
                  index={index}
                  key={`EventMarkerContainer-${item.y},${item.x}`}
                  position={{ lat: +item.y, lng: +item.x }}
                  name={item.place_name}
                  address={item.address_name}
                  phone={item.phone}
                  url={item.place_url}
                  categoryName={item.category_name}
                  onClick={() => setSelectedMarker(index)}
                  isClicked={selectedMarker === index}
                />
                {mapLevel < 7 && (
                  <CustomOverlayMap
                    className="bg-gray-50 mt-5 rounded-sm px-1"
                    position={{ lat: +item.y, lng: +item.x }}
                    key={`content-${item.y},${item.x}`}
                  >
                    {item.place_name}
                  </CustomOverlayMap>
                )}
              </div>
            ))}
        </MarkerClusterer>
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
