"use client";
import React, { useEffect, useState } from "react";
import http_request from "../../../http-request";
import { ReactLoader } from "../components/common/Loading";

const ServiceCenterSearch = () => {
    const [pincode, setPincode] = useState("");
    const [serviceCenters, setServiceCenters] = useState([]);
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllService();
    }, []);

    const getAllService = async () => {
        try {
            let response = await http_request.get("/getAllService");
            let { data } = response;
            setServiceCenters(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch service centers.");
        }
    };

    const fetchServiceCenters = () => {
        if (!pincode) {
            setError("Please enter a valid pincode.");
            return;
        }
        setError("");

        const filtered = serviceCenters.filter(
            (center) =>
                center.postalCode === pincode || center.pincodeSupported?.includes(pincode)
        );

        if (filtered.length === 0) {
            setError("No service centers found for this pincode.");
        }
        console.log("filtered", filtered);

        setFilteredCenters(filtered);
    };

   
    const shareOnWhatsApp = (center) => {
        const message = `Service Center Details:
        Name: ${center.serviceCenterName}
        Address: ${center.streetAddress}
        Phone: ${center.contact}
        State: ${center.state}
        City: ${center.city}`;
    
        const encodedMessage = encodeURIComponent(message);
    
        // Detect if the user is on a mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
        const whatsappURL = isMobile
            ? `https://wa.me/?text=${encodedMessage}`  // Opens WhatsApp app on mobile
            : `https://web.whatsapp.com/send?text=${encodedMessage}`; // Opens WhatsApp Web on desktop
    
        window.open(whatsappURL, "_blank");
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen  bg-gray-100 p-4">
            <div className="flex justify-center mt-5 mb-5 ">
                <img
                    src="/Logo.png" // Replace with actual logo path
                    alt="Servsy Logo"
                    className="h-16 w-auto rounded-md" // Adjust size as needed
                />
            </div>
            <h2 className="text-2xl font-bold mb-4">Find Service Center</h2>

            <div className="w-full max-w-md flex space-x-2">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchServiceCenters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            {loading && <ReactLoader />}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <div className="mt-6 w-full max-w-md">
                {filteredCenters.length > 0
                    ? filteredCenters.map((center, i) => (
                        <div
                            key={center._id}
                            className="bg-white p-4 mb-4 rounded-lg shadow-lg"
                        >
                            <h3 className="text-lg font-bold">{i + 1}. {center.serviceCenterName}</h3>
                            <p className="text-sm text-gray-600">{center.streetAddress}</p>
                            <p className="text-sm text-gray-800 font-semibold">
                                Phone: {center.contact}
                            </p>
                            <p className="text-sm text-gray-800 font-semibold">
                                State: {center.state}
                            </p>
                            <p className="text-sm text-gray-800 font-semibold">
                                City: {center.city}
                            </p>
                            <button
                                onClick={() => shareOnWhatsApp(center)}
                                className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Share on WhatsApp
                            </button>
                        </div>
                    ))
                    : !error && (
                        <p className="mt-4 text-gray-600">
                            Enter a pincode to find service centers.
                        </p>
                    )}
            </div>
        </div>
    );
};

export default ServiceCenterSearch;
