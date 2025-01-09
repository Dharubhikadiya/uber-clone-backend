const axios = require("axios");

module.exports.getAddressCoordinates = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "YourAppName",
      },
    });

    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
      };
    } else {
      throw new Error("No results found for the given address");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  try {
    const originCoords = await this.getAddressCoordinates(origin);
    const destCoords = await this.getAddressCoordinates(destination);

    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=false`;

    const response = await axios.get(url);

    if (
      response.data.code === "Ok" &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const route = response.data.routes[0];
      return {
        distance: `${Math.round(route.distance / 1000)} km`,
        duration: `${Math.floor(route.duration / 3600)} hours ${Math.floor(
          (route.duration % 3600) / 60
        )} minutes`,
      };
    } else {
      throw new Error("Route not found");
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    throw error;
  }
};

module.exports.getAutocompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Address is required");
  }

  try {
    const encodedAddress = encodeURIComponent(input);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1&limit=5`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "YourAppName",
      },
    });

    if (response.data && response.data.length > 0) {
      return response.data.map((place) => ({
        display_name: place.display_name,
        lat: place.lat,
        lon: place.lon,
        address: place.address,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw error;
  }
};
