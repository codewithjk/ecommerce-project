const geolib = require("geolib");

// Function to convert PIN code to coordinates using Nominatim API
async function getCoordinatesFromPIN(pin) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json&limit=1`
    );
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error("No results found for the provided PIN code");
    }
  } catch (error) {
    throw new Error("Error fetching coordinates from Nominatim API");
  }
}

// Function to calculate distance between two PIN codes
async function calculateDistanceBetweenPINs(pin1, pin2) {
  try {
    const coord1 = await getCoordinatesFromPIN(pin1);
    const coord2 = await getCoordinatesFromPIN(pin2);
    const distance = Math.round(geolib.getDistance(coord1, coord2) / 1000);

    return distance;
  } catch (error) {
    throw error;
  }
}

module.exports = { calculateDistanceBetweenPINs };
