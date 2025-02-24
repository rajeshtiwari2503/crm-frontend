 "use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "@mui/icons-material";
import Sidenav from "@/app/components/Sidenav";
import DealerDashboard from "@/app/dashboard/deallerDashboard";
import http_request from "../../../../../../http-request";

const DealerDetails = ({ params }) => {
  const router = useRouter();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashData, setDashData] = useState("");
  const [value, setBrandValue] = useState(null);
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    if (params.id) {
      getDealerById();
      getAllDashboard();
      setBrandValue({ _id: params.id, role: "DEALER" });
    }
  }, [params.id]);

  const getDealerById = async () => {
    try {
      let response = await http_request.get(`/getDealerBy/${params.id}`);
      let { data } = response;
      setDealer(data);

      // Fetch brand name if necessary
      if (data.brandId) {
        fetchBrandName(data.brandId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrandName = async (brandId) => {
    try {
      let response = await http_request.get(`/getBrand/${brandId}`);
      setBrandName(response.data?.name || "N/A");
    } catch (err) {
      console.error("Failed to fetch brand name:", err);
    }
  };

  const getAllDashboard = async () => {
    try {
      let response = await http_request.get(`/dashboardDetailsByDealerId/${params.id}`);
      setDashData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    router.push(`/user/dealer/edit/${dealer?._id}`);
  };

  if (!dealer) return <div>Loading...</div>;

  return (
    <Sidenav>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">Dealer Details</h2>
          <div
            onClick={handleEdit}
            className="flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white"
          >
            <Edit /> <span className="ml-3">Edit</span>
          </div>
        </div>
        <hr />

        {/* Dealer Info */}
        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
          <div className="text-xl font-semibold">Dealer Name:</div>
          <div className="text-lg font-medium">{dealer?.name}</div>

          <div className="text-xl font-semibold">Brand Name:</div>
          <div className="text-lg font-medium">{brandName}</div>

          <div className="text-xl font-semibold">Email:</div>
          <div className="text-lg font-medium">{dealer?.email}</div>

          <div className="text-xl font-semibold">Contact:</div>
          <div className="text-lg font-medium">{dealer?.contact}</div>

          <div className="text-xl font-semibold">Password:</div>
          <div className="text-lg font-medium">{dealer?.password}</div>
        </div>

        {/* Locations */}
        <h2 className="mt-6 text-xl font-bold text-gray-900">Locations</h2>
        <div className="m-5 grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          {dealer?.locations?.map((location, index) => (
            <div key={index} className="border p-4 rounded-md shadow-md">
              <div className="text-lg font-semibold">State:</div>
              <div className="text-md font-medium">{location.state}</div>

              <div className="text-lg font-semibold">City:</div>
              <div className="text-md font-medium">{location.city}</div>

              {location.otherCities?.length > 0 && (
                <>
                  <div className="text-lg font-semibold">Other Cities:</div>
                  <div className="text-md font-medium">
                    {location.otherCities.join(", ")}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Dashboard */}
        <h2 className="mt-6 text-xl font-bold text-gray-900">Dealer Dashboard</h2>
        <DealerDashboard dashData={dashData} userData={value} />
      </div>
    </Sidenav>
  );
};

export default DealerDetails;
