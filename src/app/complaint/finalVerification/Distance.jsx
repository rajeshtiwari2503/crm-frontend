import React, { useState } from "react";
import axios from "axios";

const PincodeDistanceCalculator = () => {
  const [pincode1, setPincode1] = useState("");
  const [pincode2, setPincode2] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  const getCoordinates = async (pincode) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: pincode,
            region: "in", // Adding region bias for India
            key: "AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k", // Replace with your API key
          },
        }
      );

      console.log(response.data); // Debugging: log the full response

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error(`No results found for pincode: ${pincode}`);
      }
    } catch (err) {
      console.error(`Error fetching coordinates for ${pincode}:`, err.message);
      throw new Error(`Unable to fetch coordinates for pincode: ${pincode}`);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLng = toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) *
        Math.cos(toRadians(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c; // Distance in kilometers
  };

  const handleCalculate = async () => {
    setError("");
    setDistance(null);

    if (!pincode1 || !pincode2) {
      setError("Please enter both pincodes.");
      return;
    }

    try {
      const coord1 = await getCoordinates(pincode1);
      const coord2 = await getCoordinates(pincode2);

      if (coord1 && coord2) {
        const calculatedDistance = calculateDistance(coord1, coord2);
        setDistance(calculatedDistance.toFixed(2)); // Round to 2 decimal places
      } else {
        setError("Unable to fetch coordinates for one or both pincodes.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Pincode Distance Calculator</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Pincode 1</label>
        <input
          type="text"
          value={pincode1}
          onChange={(e) => setPincode1(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Pincode 2</label>
        <input
          type="text"
          value={pincode2}
          onChange={(e) => setPincode2(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Calculate Distance
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {distance && (
        <p className="text-green-500 mt-4">
          Distance: {distance} km
        </p>
      )}
    </div>
  );
};

export default PincodeDistanceCalculator;
