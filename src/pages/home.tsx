import React, { useEffect, useState } from "react";
import { Map, CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";

export const Home = () => {
  const [coords, setCoords] = useState({ lat: 33.55635, lng: 126.795841 });
  const [errorMessage, setErrorMessage] = useState<GeolocationPositionError>();
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Map center={coords} style={{ width: "100%", height: "360px" }}>
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
