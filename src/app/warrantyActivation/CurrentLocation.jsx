import React, { useState, useEffect } from 'react';

const CurrentLocation = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
          });
  
          // Fetch address and pincode using a reverse geocoding API
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`)
            .then((response) => response.json())
            .then((data) => {
              console.log('Geocoding API Response:', data); // Check the full response here
  
              if (data.results && data.results.length > 0) {
                const bestMatch = data.results[0]; // Start by checking the first result
                const postalCode = bestMatch.address_components.find(component => component.types.includes('postal_code'));
  
                setAddress(bestMatch.formatted_address);
                setPincode(postalCode ? postalCode.long_name : 'Pincode not found');
              } else {
                console.warn('No results found for the given coordinates.');
              }
            })
            .catch((error) => {
              console.error("Error fetching address: ", error);
            });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);
  
  

  return (
    <div>
      <h2>Current Location:</h2>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <p>Address: {address}</p>
      <p>Pincode: {pincode}</p>
    </div>
  );
  
};

export default CurrentLocation;
