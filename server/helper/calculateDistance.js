// // const fetch = require('node-fetch');
// const geolib = require("geolib");

// // Function to convert ZIP code to coordinates using Zippopotamus API
// async function getCoordinatesFromPIN(pin) {
//   try {
//     const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
//     const data = await response.json();
//     // console.log("API Response:", data); // Log the API response
//     if (
//       Array.isArray(data) &&
//       data.length > 0 &&
//       data[0].Status === "Success"
//     ) {
//       //   const { Latitude, Longitude } = data[0].PostOffice[0];
//       //   console.log(Latitude, Longitude);
//       console.log(data[0].PostOffice[0]);
//       return {
//         latitude: parseFloat(Latitude),
//         longitude: parseFloat(Longitude),
//       };
//     } else {
//       throw new Error("No results found for the provided PIN code");
//     }
//   } catch (error) {
//     throw new Error(
//       "Error fetching coordinates from India Postal PIN Code API"
//     );
//   }
// }

// // Function to calculate distance between two ZIP codes
// async function calculateDistanceBetweenZIPs(zip1, zip2) {
//   try {
//     const coord1 = await getCoordinatesFromPIN(zip1);
//     const coord2 = await getCoordinatesFromPIN(zip2);
//     const distance = geolib.getDistance(coord1, coord2);
//     return distance;
//   } catch (error) {
//     throw error;
//   }
// }

// // Example usage
// calculateDistanceBetweenZIPs("682020", "671552")
//   .then((distance) => console.log("Distance:", distance, "meters"))
//   .catch((error) => console.error("Error:", error.message));

/////////////

// const fetch = require("node-fetch");
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
    const distance = geolib.getDistance(coord1, coord2);
    return distance;
  } catch (error) {
    throw error;
  }
}

// Example usage
calculateDistanceBetweenPINs("682011", "683572")
  .then((distance) => console.log("Distance:", distance, "meters"))
  .catch((error) => console.error("Error:", error.message));
