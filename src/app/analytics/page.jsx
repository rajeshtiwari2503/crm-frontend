 "use client";
import React, { useState } from "react";
import Sidenav from "../components/Sidenav";
import dynamic from "next/dynamic";
import StatewisePendingComplaints from "./StatewisePendingComplaints";
import DistrictWisePendingComplaints from "./DistrictWisePendingComplaints";
import ServiceCenterWisePendingComplaints from "./ServiceCenterWisePendingComplaints";
import NoServiceableAreaComplaints from "./NoServiceableAreaComplaints";
import BrandComplaintInsights from "./BrandComplaintInsights";

const AreaChart = dynamic(() => import("./charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>,
});
const PieChart = dynamic(() => import("./charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>,
});

const Analytics = () => {
  const [activeSection, setActiveSection] = useState("state");

  const renderSection = () => {
    switch (activeSection) {
      case "state":
        return <StatewisePendingComplaints />;
      case "district":
        return <DistrictWisePendingComplaints />;
      case "serviceCenter":
        return <ServiceCenterWisePendingComplaints />;
      case "noServiceArea":
        return <NoServiceableAreaComplaints />;
      case "brandStats":
        return <BrandComplaintInsights />;
    //   case "outOfTat":
    //     return <OutOfTatComplaints />;
      default:
        return <StatewisePendingComplaints />;
    }
  };

  return (
    <>
      <Sidenav>
        <>
          {/* <h2 className="text-lg mb-2 ">Analytics</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 rounded-lg shadow px-4 py-4 bg-white">
              <AreaChart />
            </div>
            <div className="col-span-7 rounded-lg shadow px-4 py-4 bg-white">
              <PieChart />
            </div>
          </div> */}

          <div className="p-4 text-center">
            {/* <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveSection("state")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Statewide Pending Complaints
              </button>
              <button
                onClick={() => setActiveSection("district")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                District Wise Pending Complaints
              </button>
              <button
                onClick={() => setActiveSection("serviceCenter")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Service-Center Wise Pending Complaints
              </button>
              <button
                onClick={() => setActiveSection("noServiceArea")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                No Serviceable Area Complaints
              </button>
              <button
                onClick={() => setActiveSection("brandStats")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Brand Complaint Stats
              </button>
              <button
                onClick={() => setActiveSection("outOfTat")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Out Of Tat Complaints
              </button>
            </div>
            <div>{renderSection()}</div>
          </div>
        </>
      </Sidenav>
    </>
  );
};

export default Analytics;
