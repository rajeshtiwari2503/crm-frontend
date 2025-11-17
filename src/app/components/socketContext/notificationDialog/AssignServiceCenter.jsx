'use client';
import React from 'react';

const AssignService = ({ data }) => {
  if (!data) return null;

  return (
    <>
      <h2 className="text-lg font-bold text-gray-800 mb-2">🔔 Complaint Update</h2>

      <p><strong>Complaint Number:</strong> {data?.complaintNumber}</p>
      <p><strong>Status:</strong> <span className="text-blue-600">{data?.status}</span></p>
      <p><strong>Assigned To:</strong> {data?.assignServiceCenter || data?.assignedTo?.serviceCenterId || "N/A"}</p>
      <p><strong>Customer:</strong> {data?.fullName}</p>
      <p><strong>Phone:</strong> {data?.phoneNumber}</p>
      <p><strong>Brand:</strong> {data?.productBrand}</p>
      <p><strong>Product:</strong> {data?.productName}</p>
      <p><strong>District:</strong> {data?.district}</p>
      <p><strong>State:</strong> {data?.state}</p>
      <p><strong>Pincode:</strong> {data?.pincode}</p>
      <p className="text-sm text-gray-500 mt-2">
        <strong>Updated At:</strong>{' '}
        {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}
      </p>

      <p className="text-green-600 font-medium mt-4">{data?.message}</p>
    </>
  );
};

export default AssignService;
