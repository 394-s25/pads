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
