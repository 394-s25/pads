// import React, { useState, useEffect, useRef } from "react";
// import {
//   APIProvider,
//   ControlPosition,
//   MapControl,
//   Map,
//   AdvancedMarker,
//   Pin,
//   useMap,
//   useMapsLibrary,
// } from "@vis.gl/react-google-maps";
// import "./locationMap.css";

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const LocationMap = ({ latitude, longitude }) => {
//   const [selectedPlace, setSelectedPlace] = useState(null);

//   // Northwestern coordinates for a default fallback value
//   const defaultLatitude = 42.056431490213846;
//   const defaultLongitude = -87.67533674079739;

//   // Check if the values aren't null
//   const currentLatitude = latitude || defaultLatitude;
//   const currentLongitude = longitude || defaultLongitude;

//   console.log(currentLatitude);
//   console.log(currentLongitude);

//   // Location Marker
//   const LocationMarkers = ({ latitude, longitude }) => {
//     return (
//       <>
//         <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
//           <Pin
//             background={"#FF0000"}
//             glyphColor={"#000"}
//             borderColor={"#000"}
//           />
//         </AdvancedMarker>
//       </>
//     );
//   };
//   return (
//     <APIProvider
//       apiKey={GOOGLE_MAPS_API_KEY}
//       onLoad={() => console.log("Maps API has loaded.")}
//     >
//       <Map
//         defaultZoom={15}
//         defaultCenter={{ lat: currentLatitude, lng: currentLongitude }}
//         mapId={"696a2e1d90de87cc2a636ab2"}
//         onCameraChanged={(ev) =>
//           console.log(
//             "Camera changed: ",
//             ev.detail.center,
//             "zoom:",
//             ev.detail.zoom
//           )
//         }
//       >
//         <LocationMarkers
//           latitude={currentLatitude}
//           longitude={currentLongitude}
//         ></LocationMarkers>
//       </Map>
//       <MapControl position={ControlPosition.TOP}>
//         <div className="autocomplete-control">
//           <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
//         </div>
//       </MapControl>
//       <MapHandler place={selectedPlace}></MapHandler>
//     </APIProvider>
//   );
// };

// const MapHandler = ({ place, marker }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || !place || !marker) return;
//     if (place.geometry?.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     }
//     marker.position = place.geometry?.location;
//   }, [map, place, marker]);

//   return null;
// };

// const PlaceAutocomplete = ({ onPlaceSelect }) => {
//   const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
//   const inputRef = useRef(null);
//   const places = useMapsLibrary("places");

//   useEffect(() => {
//     if (!places || !inputRef.current || !globalThis.google) return;

//     const options = {
//       fields: ["geometry", "name", "formatted_address"],
//     };

//     const autocomplete = new globalThis.google.maps.places.Autocomplete(
//       inputRef.current,
//       options
//     );
//     setPlaceAutocomplete(autocomplete);
//   }, [places]);

//   useEffect(() => {
//     if (!placeAutocomplete) return;

//     const listener = placeAutocomplete.addListener("place_changed", () => {
//       onPlaceSelect(placeAutocomplete.getPlace());
//     });

//     return () => listener.remove();
//   }, [placeAutocomplete, onPlaceSelect]);

//   return (
//     <div className="autocomplete-container">
//       <input ref={inputRef}></input>
//     </div>
//   );
// };

// export default LocationMap;

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

const LocationMap = ({ latitude, longitude }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  return (
    <APIProvider
      apiKey={API_KEY}
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
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
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
