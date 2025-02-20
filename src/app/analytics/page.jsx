 "use client";
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import dynamic from "next/dynamic";
import StatewisePendingComplaints from "./StatewisePendingComplaints";
import DistrictWisePendingComplaints from "./DistrictWisePendingComplaints";
import ServiceCenterWisePendingComplaints from "./ServiceCenterWisePendingComplaints";
import NoServiceableAreaComplaints from "./NoServiceableAreaComplaints";
import BrandComplaintInsights from "./BrandComplaintInsights";
import PerticularBrandights from "./PerticularBrandInsights";
import { useUser } from "../components/UserContext";

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
      default:
        return <StatewisePendingComplaints />;
    }
  };
 const { user } = useUser();
 

  return (
    <>
      <Sidenav>
      {user?.user.role==="ADMIN"?  <div className="p-4 text-center">
          <div className="flex space-x-4 mb-6 bg-[#09090b] p-2">
            <button
              onClick={() => setActiveSection("state")}
              className={` px-2  py-1 rounded ${activeSection === "state" ? "bg-[#09090b]  text-[#fafafa]" : "bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300  text-[#09090b]"}  `}
            >
              Statewide Pending Complaints
            </button>
            <button
              onClick={() => setActiveSection("district")}
              className={` px-2  py-1 rounded ${activeSection === "district" ? "bg-[#09090b]  text-[#fafafa]" : "bg-white shadow-md hover:shadow-xl transition-shadow duration-300  text-[#09090b]"}  `}
            >
              District Wise Pending Complaints
            </button>
            <button
              onClick={() => setActiveSection("serviceCenter")}
              className={` px-2  py-1 rounded ${activeSection === "serviceCenter" ? "bg-[#09090b]  text-[#fafafa]" : "bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300  text-[#09090b]"}  `}
            >
              Service-Center Wise Pending Complaints
            </button>
            <button
              onClick={() => setActiveSection("noServiceArea")}
              className={` px-2  py-1 rounded ${activeSection === "noServiceArea" ? "bg-[#09090b]  text-[#fafafa]" : "bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300  text-[#09090b]"}  `}
            >
              No Serviceable Area Complaints
            </button>
            <button
              onClick={() => setActiveSection("brandStats")}
              className={` px-2  py-1 rounded ${activeSection === "brandStats" ? "bg-[#09090b]  text-[#fafafa]" : "bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300  text-[#09090b]"}  `}
            >
              Brand Complaint Stats
            </button>
          </div>
          <div>{renderSection()}</div>
        </div>
        :
        <PerticularBrandights user={user?.user} />
      }
      </Sidenav>
    </>
  );
};

export default Analytics;
