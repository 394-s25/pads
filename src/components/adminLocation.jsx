import React, { useEffect, useState } from "react";
import AdminMap from "./adminMap";
import "./location.css";

const AdminLocation = ({ onLocationSelect }) => {
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
          <AdminMap
            id="map"
            latitude={location.latitude}
            longitude={location.longitude}
            onLocationSelect={onLocationSelect}
          ></AdminMap>
        </div>
      ) : (
        <p>{error || "Loading location..."}</p>
      )}
    </div>
  );
};

export default AdminLocation;
