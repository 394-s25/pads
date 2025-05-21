import React, { useEffect, useRef } from "react";

const PlacesAutocomplete = ({ value, onChange, disabled }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    function initAutocomplete() {
      if (!inputRef.current || autocompleteRef.current) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "us" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        const formatted = place.formatted_address || inputRef.current.value;

        onChange({
          target: {
            name: "location",
            value: formatted,
          },
        });
      });
    }

    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current.unbindAll();
        autocompleteRef.current = null;
      }
    };
  }, [onChange]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Enter a location"
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all z-10"
        autoComplete="off"
        id="autocomplete-location"
      />
    </div>
  );
};

export default PlacesAutocomplete;
