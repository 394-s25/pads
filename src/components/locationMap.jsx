import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import "./locationMap.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HeatmapOverlay = ({ useHeatMap }) => {
  const map = useMap();
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    if (!map || !window.google || !google.maps.visualization) return;

    let heatmapLayer = null;

    if (useHeatMap) {
      heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map,
      });
      setHeatmap(heatmapLayer);
    }

    return () => {
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
      }
    };
  }, [map, useHeatMap]);

  function getPoints() {
    return [
      new google.maps.LatLng(42.0526711, -87.674528),
      new google.maps.LatLng(42.05215, -87.675),
      new google.maps.LatLng(42.0529, -87.6739),
      new google.maps.LatLng(42.0533, -87.6748),
      new google.maps.LatLng(42.053, -87.6735),
      new google.maps.LatLng(42.0523, -87.673),
      new google.maps.LatLng(42.0518, -87.6737),
      new google.maps.LatLng(42.0516, -87.6746),
      new google.maps.LatLng(42.0519, -87.6753),
      new google.maps.LatLng(42.0524, -87.6758),
      new google.maps.LatLng(42.053, -87.6754),
      new google.maps.LatLng(42.0534, -87.674),
      new google.maps.LatLng(42.0532, -87.6732),
      new google.maps.LatLng(42.0526, -87.6729),
    ];
  }
};

const LocationMap = ({ latitude, longitude }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [useHeatMap, setUseHeatMap] = useState(false);
  return (
    <APIProvider
      apiKey={API_KEY}
      libraries={["visualization"]}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={"696a2e1d90de87cc2a636ab2"}
        defaultZoom={16}
        defaultCenter={{ lat: latitude, lng: longitude }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <AdvancedMarker
          ref={markerRef}
          position={{ lat: latitude, lng: longitude }}
        />
        <HeatmapOverlay useHeatMap={useHeatMap}></HeatmapOverlay>
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </div>
        <div className="heatmap-control">
          <button onClick={() => setUseHeatMap(!useHeatMap)}>
            Show heatmap
          </button>
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
  }, [map, place, marker]);
  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);
  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

export default LocationMap;
