const ridemodel = require("../models/ride.model");
const mapsService = require("./maps.service");
const crypto = require("crypto");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ message: "Pickup and destination are required" });
  }

  const distanceTime = await mapsService.getDistanceTime(pickup, destination);

  // Extract numeric values from distance and duration strings
  const distanceKm = parseFloat(distanceTime.distance.split(" ")[0]);
  const durationMinutes = parseFloat(distanceTime.duration.split(" ")[0]) * 60; // Convert hours to minutes

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    motorcycle: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  console.log(distanceTime);

  const fare = {
    auto:
      baseFare.auto +
      (distanceKm / 1000) * perKmRate.auto +
      (durationMinutes / 60) * perMinuteRate.auto,
    car:
      baseFare.car +
      (distanceKm / 1000) * perKmRate.car +
      (durationMinutes / 60) * perMinuteRate.car,
    motorcycle:
      baseFare.motorcycle +
      (distanceKm / 1000) * perKmRate.motorcycle +
      (durationMinutes / 60) * perMinuteRate.motorcycle,
  };

  return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
  function generateOTP(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOTP(num);
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  console.log(fare);

  const ride = ridemodel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};
