import React, { useState, useEffect } from 'react';
import http_request from "../../../../../http-request";

const EditWarrantyDetails = ({ data ,handleEdit}) => {
  const [formData, setFormData] = useState({
    userName: '',
    contact: '',
    email: '',
    address: '',
    lat: '',
    long: '',
    pincode: '',
    isActivated: false, // Default value is false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Use effect to populate the form when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        userName: data.userName || '',
        contact: data.contact || '',
        email: data.email || '',
        address: data.address || '',
        lat: data.lat || '',
        long: data.long || '',
        pincode: data.pincode || '',
        isActivated: data.isActivated || false,
      });
    }
  }, [data]); // Run whenever `data` changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation to check if required fields are filled
    if (!formData.userName || !formData.contact || !formData.email) {
      setMessage('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    try {
      // Submitting the form with the updated isActivated value
      const response = await http_request.patch('/editActivationWarranty', {
        uniqueId: data.uniqueId, // Assuming `uniqueId` exists in `data`
        updates: { ...formData }, // Send the updated formData including isActivated
      });
      handleEdit(false)
      setMessage(response.data.message);
    } catch (error) {
      handleEdit(false)

      console.error('Error updating details:', error);
      setMessage(error.response?.data?.message || 'An error occurred while updating the details.');
    } finally {
      handleEdit(false)

      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // Handle checkbox state change
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Handle other inputs
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Warranty Details</h1>

      {message && <p className="mb-4 text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">User Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Latitude:</label>
          <input
            type="text"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Longitude:</label>
          <input
            type="text"
            name="long"
            value={formData.long}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="isActivated"
              checked={formData.isActivated}
              onChange={handleChange}
              className="mr-2"
            />
            Is Activated
          </label>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWarrantyDetails;
