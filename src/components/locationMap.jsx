import React from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationMap = ({ latitude, longitude }) => {
  // Northwestern coordinates for a default fallback value
  const defaultLatitude = 42.056431490213846;
  const defaultLongitude = -87.67533674079739;

  // Check if the values aren't null
  const currentLatitude = latitude || defaultLatitude;
  const currentLongitude = longitude || defaultLongitude;

  console.log(currentLatitude);
  console.log(currentLongitude);

  // Location Marker
  const LocationMarkers = ({ latitude, longitude }) => {
    return (
      <>
        <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
          <Pin
            background={"#FF0000"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      </>
    );
  };
  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        defaultZoom={15}
        defaultCenter={{ lat: currentLatitude, lng: currentLongitude }}
        mapId={"696a2e1d90de87cc2a636ab2"}
        onCameraChanged={(ev) =>
          console.log(
            "Camera changed: ",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      >
        <LocationMarkers
          latitude={currentLatitude}
          longitude={currentLongitude}
        ></LocationMarkers>
      </Map>
    </APIProvider>
  );
};

export default LocationMap;
