"use client";
import React, { useState } from 'react';
import { ToastMessage } from './common/Toastify';
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import { ReactLoader } from './common/Loading';


const ServicePincodes = ({ userId, RefreshData, pincode }) => {
    const [city, setCity] = useState('');
    const [pincodes, setPincodes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPincodes = async (city) => {
        try {
            setLoading(true);
            
            // Fetch pincodes from the Postal Pincode API
            const response = await fetch(`https://api.postalpincode.in/postoffice/${city}`);
            const data = await response.json();
    
            if (data[0].Status === "Success") {
                const districtData = data[0].PostOffice.map((office) => ({
                    name: office.Name,
                    district: office.District,
                    pincode: office.Pincode,
                }));
    
                // Filter by exact city name or district
                const filterData = districtData?.filter(
                    (f) =>
                        f?.district.toLowerCase() === city.toLowerCase() || f?.name.toLowerCase() === city.toLowerCase()
                );
    
                if (filterData.length > 0) {
                    // Map the filtered data to get the list of pincodes
                    const pincodeString = filterData.map((entry) => entry.pincode);

                    // Join the pincodes into a comma-separated string
                    const pincodes = pincodeString.join(',');
                    // Sending pincodes to the backend
                    try {
                        const responsePin = await http_request.patch(`/updateServiceCenterpincode/${userId}`, {
                            pincodes, // Sending the array of pincodes
                        });
    console.log(responsePin);
    
                        if (responsePin.status ===true) {  // Check for HTTP status code 200 (success)
                            ToastMessage('Pincodes updated successfully');
                            RefreshData(responsePin); // Refresh the data after successful update
                        } else {
                            console.error('Failed to update pincodes');
                        }
                    } catch (error) {
                        console.error('Error updating pincodes:', error);
                    }
    
                    setError(null);
                } else {
                    setError(`No data found for the provided city "${city}".`);
                    setPincodes([]);
                }
            } else {
                setError("No data found for the provided city.");
                setPincodes([]);
            }
    
            setLoading(false);  // Stop loading after the process completes
        } catch (err) {
            setLoading(false);
            setError("Error fetching data.");
            setPincodes([]);
        }
    };
    


    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            fetchPincodes(city);
        }
    };

    return (
        <div className="container   p-4">
            <Toaster />
            {loading === true ? <ReactLoader />
                : <div>
                    <h1 className="text-2xl mb-4">Add Area Pincodes</h1>
                    <div className='flex'>
                        <form onSubmit={handleSubmit} className="mb-4 flex gap-4">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter City Name"
                                className="border border-gray-400 p-2 rounded mr-2"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 w-[120px] text-white p-2 rounded"
                            >
                                Add Pincodes
                            </button>
                        </form>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className='container mx-auto p-4 '>
                        <div>Pincodes Supported</div>
                        <div className='w-[500px]'>
                            <div >{pincode}</div>
                        </div>
                    </div>
                    {/* <div>
        {pincodes.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Post Office Name</th>
                <th className="px-4 py-2">District</th>
                <th className="px-4 py-2">Pincode</th>
              </tr>
            </thead>
            <tbody>
              {pincodes.map((office, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{office.name}</td>
                  <td className="border px-4 py-2">{office.district}</td>
                  <td className="border px-4 py-2">{office.pincode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pincodes found</p>
        )}
      </div> */}
                </div>
            }
        </div>
    );
};

export default ServicePincodes;