"use client";

import React from "react";

const EmployeeProfile = ({ userData }) => {
  return (
    <div className="flex justify-center">
      <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
        <div className="text-1xl font-bold">Created:</div>
        <div className="text-1xl font-bold">
          {userData?.createdAt ? new Date(userData.createdAt).toLocaleString() : "N/A"}
        </div>

        <div className="text-1xl font-bold">Updated:</div>
        <div className="text-1xl font-bold">
          {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleString() : "N/A"}
        </div>

        <div className="text-1xl font-semibold">User Name:</div>
        <div className="text-lg font-medium">{userData?.name || "N/A"}</div>

        <div className="text-1xl font-semibold">Email:</div>
        <div className="text-lg font-medium">{userData?.email || "N/A"}</div>

        <div className="text-1xl font-semibold">Contact:</div>
        <div className="text-lg font-medium">{userData?.contact || "N/A"}</div>

        <div className="text-1xl font-semibold">Role:</div>
        <div className="text-lg font-medium">{userData?.role || "N/A"}</div>

        <div className="text-1xl font-semibold">Password:</div>
        <div className="text-lg font-medium">{userData?.password || "N/A"} </div> {/* Masked password for security */}

        <div className="text-1xl font-semibold">State Zones:</div>
        <div className="text-lg font-medium">
          {userData?.stateZone && userData.stateZone.length > 0 
            ? userData.stateZone.join(", ") 
            : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
