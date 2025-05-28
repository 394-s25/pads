import React, { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

const PlacesAutocomplete = ({ onChange, disabled }) => {
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let autocomplete;

    loadGoogleMaps(apiKey).then((maps) => {
      if (!inputRef.current) return;

      autocomplete = new maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry"],
        types: ["geocode"],
        componentRestrictions: { country: "us" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.formatted_address) {
          const fullAddress = place.formatted_address;
          console.log("Autocomplete confirmed:", fullAddress);
          onChange({
            target: {
              name: "location",
              value: fullAddress,
            },
          });
        }
      });
    });

    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      disabled={disabled}
      placeholder="Enter a location"
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
    />
  );
};

export default PlacesAutocomplete;

