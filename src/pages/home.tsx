import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Map,
  CustomOverlayMap,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";

interface IMarkerProp {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}
export const Home = () => {
  const [coords, setCoords] = useState({ lat: 33.55635, lng: 126.795841 });
  const [errorMessage, setErrorMessage] = useState<GeolocationPositionError>();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [info, setInfo] = useState<IMarkerProp | null>(null);
  const [detail, setDetail] =
    useState<kakao.maps.services.PlacesSearchResult>();
  const [markers, setMarkers] = useState<IMarkerProp[] | null>(null);
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
            setMarkers(null);
            const bounds = new kakao.maps.LatLngBounds();
            let markers: any = [];
            setDetail(data);
            data.map((item: kakao.maps.services.PlacesSearchResultItem) => {
              markers.push({
                position: {
                  lat: +item.y,
                  lng: +item.x,
                },
                content: item.place_name,
              });
              return bounds.extend(new kakao.maps.LatLng(+item.y, +item.x));
            });
            setMarkers(markers);
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
        level={10}
        style={{ width: "100%", height: "360px" }}
      >
        <MarkerClusterer averageCenter={true} minLevel={5}>
          {markers &&
            markers.map((marker) => (
              <MapMarker
                key={`marker-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => setInfo(marker)} //click >>> 그냥 밑에 보여주는 거로 바꾸기
              >
                {info && info.content === marker.content && (
                  <div
                    key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    style={{ color: "#000" }}
                  >
                    {marker.content}
                  </div>
                )}
              </MapMarker>
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
      <div>{markers && markers.map((marker) => <div>{}</div>)}</div>
    </>
  );
};
