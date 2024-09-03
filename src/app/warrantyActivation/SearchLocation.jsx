import React, { useState } from 'react';
import axios from 'axios';

const SearchLocation = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });

  const handleSearch = async () => {
    const apiKey = 'AIzaSyBvWULhEJHD7GpeeY3UC2C5N9dJZOIuyEg';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result) {
        setLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={handleSearch}>Search</button>
      {location.lat && location.lng && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
    </div>
  );
};

export default SearchLocation;
