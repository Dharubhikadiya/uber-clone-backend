const mapsService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;
  try {
    const coordinates = await mapsService.getAddressCoordinates(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error in getCoordinates:", error);
    res.status(404).json({ message: "coordinates not found" });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;
  try {
    const distanceTime = await mapsService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime);
  } catch (error) {
    console.error("Error in getDistanceTime:", error);
    res.status(404).json({ message: "distance and time not found" });
  }
};

module.exports.getAutocompleteSuggestions = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { input } = req.query;

    const suggestions = await mapsService.getAutocompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error in getAutocompleteSuggestions:", error);
    res.status(404).json({ message: "suggestions not found" });
  }
};
