'use client';
import React from 'react';
const WarrantyActivation = ({ data }) => (
  <>
    <h2 className="text-lg font-bold mb-2">🛡️ Warranty Activated</h2>
    <p><strong>Product:</strong> {data?.productName}</p>
    <p><strong>Unique ID:</strong> {data?.uniqueId}</p>
    <p><strong>Customer:</strong> {data?.fullName}</p>
    {/* <p><strong>Email:</strong> {data?.email}</p> */}
    <p><strong>Contact:</strong> {data?.contact}</p>
    <p><strong>Address:</strong> {data?.address}</p>
    <p><strong>District:</strong> {data?.district}</p>
    <p><strong>State:</strong> {data?.state}</p>
    <p><strong>Pincode:</strong> {data?.pincode}</p>
    <p><strong>Activated On:</strong> {new Date(data?.activationDate).toLocaleString()}</p>
        <p className="text-green-600 font-medium mt-4">{data?.message}</p>
  </>
);

export default WarrantyActivation;
