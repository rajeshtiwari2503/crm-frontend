import React, { useState } from 'react';
import axios from 'axios';

const SearchLocation = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const handleSearch = async () => {
    const apiKey = 'AIzaSyBvWULhEJHD7GpeeY3UC2C5N9dJZOIuyEg';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result) {
        // Extract latitude and longitude
        const { lat, lng } = result.geometry.location;
        setLocation({ lat, lng });

        // Extract formatted address
        setAddress(result.formatted_address);

        // Extract postal code (pincode)
        const postalCode = result.address_components.find(component =>
          component.types.includes('postal_code')
        );
        setPincode(postalCode ? postalCode.long_name : 'Pincode not found');
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location: ', error);
    }
  };

  return (
    <div>
      <h2>Search Location</h2>
      <div className="flex w-full max-w-md space-x-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter location"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Search
        </button>
      </div>

      
      {location.lat && location.lng && (
        <div>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lng}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Pincode:</strong> {pincode}</p>
        </div>
      )}
    </div>
  );
};

export default SearchLocation;
