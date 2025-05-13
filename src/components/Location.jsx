import React, { useEffect, useState } from "react";
import LocationMap from "./locationMap";
import "./location.css";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => setError(err.message)
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  return (
    <div>
      <h3>User Location</h3>
      {location ? (
        <div className="map-wrapper">
          <LocationMap
            id="map"
            latitude={location.latitude}
            longitude={location.longitude}
          ></LocationMap>
        </div>
      ) : (
        <p>{error || "Loading location..."}</p>
      )}
    </div>
  );
};

export default Location;
