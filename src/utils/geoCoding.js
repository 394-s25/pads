export const reverseGeocode = async (lat, lng, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK" && data.results && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    console.warn("Reverse geocoding failed. Response:", data);
    throw new Error("No address found for the given coordinates");
  }
};

export const geocode = async (address, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK" && data.results && data.results.length > 0) {
    return {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
    };
  } else {
    console.warn("geocoding failed. Response:", data);
    throw new Error("No lat / long found for the given address");
  }
};
