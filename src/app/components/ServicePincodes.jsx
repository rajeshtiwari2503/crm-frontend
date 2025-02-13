"use client";
import React, { useEffect, useState } from 'react';
import { ToastMessage } from './common/Toastify';
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import { ReactLoader } from './common/Loading';
import { useForm } from 'react-hook-form';


const ServicePincodes = ({ userId, RefreshData, pincode }) => {
   
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jsonData, setJsonData] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [pincodee, setPincode] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();




   const onSubmit = async () => {
    if (!selectedState || !selectedDistrict) {
        console.error("Please select a state and district.");
        return;
    }

    let pincodes1 = [];

    if (selectedArea === "All") {
        // Include all pincodes in the district and remove duplicates
        pincodes1 = [...new Set(jsonData[selectedState][selectedDistrict]?.map(area => area.pincode) || [])];
    } else {
        // Otherwise, send the selected pincode, ensuring uniqueness
        pincodes1 = [...new Set([selectedArea])];
    }
  const pincodes = pincodes1.join(',');
  console.log("pincodes",pincodes);
  
    try {
        setLoading(true);

        // API request to update pincodes
        const response = await http_request.patch(`/updateServiceCenterpincode/${userId}`, { pincodes });

        const { data } = response;
        ToastMessage(data);
        RefreshData(pincodes+data); // Refresh data after successful update

        setLoading(false);
         
    } catch (error) {
        setLoading(false);
        console.error("Error updating pincodes:", error);
    }
};


  

    // Handle file upload



    useEffect(() => {
        // Fetch the file from the public folder
        const loadFileFromPublic = async () => {
            try {
                const response = await fetch("/INpostalCode.txt");
                // console.log("response",response);
                // Adjust filename if needed
                const text = await response.text();  // Read file content as text

                const lines = text.trim().split("\n");
                const stateData = {};

                lines.forEach((line) => {
                    const parts = line.split("\t").map((s) => s.trim());

                    if (parts.length >= 5) {
                        const pincode = parts[1]; // Pincode
                        const areaName = parts[2]; // Area
                        const state = parts[3]; // State
                        const district = parts[5]; // District

                        if (!stateData[state]) {
                            stateData[state] = {};
                        }
                        if (!stateData[state][district]) {
                            stateData[state][district] = [];
                        }

                        stateData[state][district].push({ areaName, pincode });
                    }
                });
                // console.log("stateData",stateData);

                setJsonData(stateData);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        loadFileFromPublic();
    }, []);
    // console.log("jsonData", jsonData);


    // Handle state change
    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedDistrict("");
        setSelectedArea("");
        setPincode("");
    };

    // Handle district change
    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedArea("");
        setPincode("");
    };

    // Handle area change
    const handleAreaChange = (e) => {
        const area = e.target.value;
        setSelectedArea(area);

        const foundArea = jsonData[selectedState][selectedDistrict].find((a) => a.areaName === area);
        setPincode(foundArea ? foundArea.pincode : "");
    };


    return (
        <div className=" w-full    bg-white rounded-lg shadow-md  p-4">
            <Toaster />
            {loading === true ? <div className='mt-[-200px]'> <ReactLoader /></div>
                : <div className='w-full'>

                    <h1 className="text-xl font-bold mb-4">Add Area Pincodes</h1>
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-2">Select State, District, and Area</h2>


                        {/* State Dropdown */}
                        {Object.keys(jsonData).length > 0 && (
                            <select value={selectedState} onChange={handleStateChange} className="border p-2 rounded mt-4 block">
                                <option value="">Select State</option>
                                {Object.keys(jsonData).map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* District Dropdown */}
                        {selectedState && jsonData[selectedState] && (
                            <select value={selectedDistrict} onChange={handleDistrictChange} className="border p-2 rounded mt-4 block">
                                <option value="">Select District</option>
                                {Object.keys(jsonData[selectedState]).map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Area Dropdown */}
                        {selectedDistrict && jsonData[selectedState][selectedDistrict] && (
                            <select value={selectedArea} onChange={handleAreaChange} className="border p-2 rounded mt-4 block">
                                <option value=" ">Select Area</option> {/* Include All Option */}
                                <option value="All">All</option> {/* Include All Option */}
                                {jsonData[selectedState][selectedDistrict].map((area, index) => (
                                    <option key={index} value={area.pincode}>
                                        {area.pincode}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400"
                        >
                            {loading ? "Processing..." : "Add Pincode "}
                        </button>


                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {/* <div className='   p-4 '>
                        <div className='text-md font-bold mb-4'>Pincodes Supported</div>
                        <div className="w-100 grid grid-cols-3 md:grid-cols-10 overflow-x-auto whitespace-nowrap">
                            {pincode?.map((item, i) =>

                                <div key={i} className=' '>
                                    <div >{item}</div>
                                </div>
                            )}
                        </div>
                       
                    </div> */}

                </div>
            }
        </div>
    );
};

export default ServicePincodes;

