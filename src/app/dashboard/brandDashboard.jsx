
import React, { useEffect, useState } from 'react';

import http_request from '../../../http-request';

import CountUp from 'react-countup';


import { Chart } from 'react-google-charts';
import RecentServicesList from '../complaint/RecentServices';
import { useRouter } from 'next/navigation';


const BrandDashboard = (props) => {

  const router = useRouter()

  const userData = props?.userData;
  const dashData = props?.dashData;
  const [complaint, setComplaint] = useState([]);
  const [warranty, setWarranty] = useState(0);
  const [refresh, setRefresh] = useState("");
  const [averageCT, setAverageCT] = useState(0);
  const [walletAmnt, setWalletAmnt] = useState(0);

  useEffect(() => {
    getAllComplaint();
    getWarrantyById()
    getWalletAmountById()
  }, [refresh]);

  const getWalletAmountById = async () => {
    try {
      let response = await http_request.get(`/getAllRecharge`);
      let { data } = response;

      // Debugging the response structure
      console.log("API response data:", data);

      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        return;
      }

      // Filtering data by userData._id
      const userId = userData?.role === "BRAND" ? userData?._id : userData?.brandId;
      if (!userId) {
        console.error("userData._id is not available");
        return;
      }

      const filterBrandData = data.filter((item) => item?.brandId === userId);

      // Debugging filtered data
      console.log("Filtered data for brandId:", userId, filterBrandData);

      // Calculating total amount
      const totalAmount = filterBrandData.reduce((total, item) => {
        const amount = Number(item?.amount);
        if (isNaN(amount)) {
          console.warn(`Invalid amount found: ${item?.amount}`);
          return total;
        }
        return total + amount;
      }, 0);

      // Debugging total amount
      console.log("Total wallet amount:", totalAmount);

      setWalletAmnt(totalAmount);
    } catch (err) {
      console.error("Error fetching wallet amount:", err);
    }
  };

  const getWarrantyById = async () => {
    try {
      let response = await http_request.get(`/getAllProductWarrantyByBrandIdTotal/${userData?.role === "BRAND" ? userData?._id : userData?.brandId}`)
      let { data } = response
      // console.log(data);

      setWarranty(data);

    }
    catch (err) {
      console.log(err)
    }
  }
  // console.log("jgjgjjg",warranty);
 


   

  // const getAllComplaint = async () => {
  //   try {
  //     let response = await http_request.get("/getAllComplaint");
  //     let { data } = response;
  
  //     // Filter complaints for the brand and required statuses
  //     const filteredComplaints = data.filter(
  //       (item) => item?.brandId === userData._id &&
  //         ["COMPLETED", "FINAL VERIFICATION"].includes(item.status)
  //     );
  
  //     // Function to safely calculate time difference (in hours)
  //     const getTimeDifference = (start, end) =>
  //       start && end ? Math.max((new Date(end) - new Date(start)) / (1000 * 60 * 60), 0) : 0;
  
  //     // Function to adjust complaint date
  //     const adjustDate = (date) => {
  //       let newDate = new Date(date);
  //       if (newDate.getHours() > 12) {
  //         newDate.setDate(newDate.getDate() + 1);
  //         newDate.setHours(0, 0, 0, 0);
  //       }
  //       return newDate;
  //     };
  
  //     // Function to calculate percentage
  //     const calculatePercentage = (count, total) => total > 0 ? ((count / total) * 100).toFixed(2) : "0.00";
  
  //     // Process complaints using reduce for better performance
  //     const { monthlyReport, yearlyReport, totalTATCount, totalComplaints } = filteredComplaints.reduce((acc, c) => {
  //       const complaintDate = adjustDate(c.createdAt);
  //       const complaintCloseDate = c.complaintCloseTime ? new Date(c.complaintCloseTime) : null;
  
  //       const monthYear = complaintDate.toLocaleString("default", { month: "long", year: "numeric" });
  //       const year = complaintDate.getFullYear();
  
  //       // Calculate TAT (Total Turnaround Time)
  //       let tat = getTimeDifference(complaintDate, complaintCloseDate);
  
  //       // Update total complaints count
  //       acc.totalComplaints++;
  
  //       // Count TAT within the allowed limit (≤ 24 hours)
  //       if (tat <= 24) acc.totalTATCount++;
  
  //       // Update Monthly Report
  //       if (!acc.monthlyReport[monthYear]) {
  //         acc.monthlyReport[monthYear] = { complaints: [], tatCount: 0, totalComplaints: 0 };
  //       }
  //       acc.monthlyReport[monthYear].complaints.push(c);
  //       acc.monthlyReport[monthYear].totalComplaints++;
  //       if (tat <= 24) acc.monthlyReport[monthYear].tatCount++;
  
  //       // Update Yearly Report
  //       if (!acc.yearlyReport[year]) {
  //         acc.yearlyReport[year] = { complaints: [], tatCount: 0, totalComplaints: 0 };
  //       }
  //       acc.yearlyReport[year].complaints.push(c);
  //       acc.yearlyReport[year].totalComplaints++;
  //       if (tat <= 24) acc.yearlyReport[year].tatCount++;
  
  //       return acc;
  //     }, { monthlyReport: {}, yearlyReport: {}, totalTATCount: 0, totalComplaints: 0 });
  
  //     // Calculate Overall TAT Percentage
  //     let overallTATPercentage = calculatePercentage(totalTATCount, totalComplaints);
  
  //     // Process final reports
  //     const processReport = (report) => Object.keys(report).map((key) => {
  //       let { complaints, tatCount, totalComplaints } = report[key];
  
  //       return {
  //         period: key,
  //         tatPercentage: calculatePercentage(tatCount, totalComplaints),
  //         complaints,
  //       };
  //     });
  
  //     let finalMonthlyReport = processReport(monthlyReport);
  //     let finalYearlyReport = processReport(yearlyReport);
  
  //     console.log("📊 Overall TAT Percentage:", overallTATPercentage + "%");
  //     console.log("📊 Monthly Report:", finalMonthlyReport);
  //     console.log("📊 Yearly Report:", finalYearlyReport);
  //   } catch (err) {
  //     console.log("Error fetching complaints:", err);
  //   }
  // };
  
  
  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint");
      let { data } = response;
  
      // Filter complaints for the brand and required statuses
      const filteredComplaints = data.filter(
        (item) => item?.brandId === userData._id &&
          ["COMPLETED", "FINAL VERIFICATION"].includes(item.status)
      );
  
      // Function to calculate time difference in hours
      const getTimeDifference = (start, end) =>
        start && end ? Math.max((new Date(end) - new Date(start)) / (1000 * 60 * 60), 0) : 0;
  
      // Function to adjust complaint date if needed
      const adjustDate = (date) => {
        let newDate = new Date(date);
        if (newDate.getHours() > 12) {
          newDate.setDate(newDate.getDate() + 1);
          newDate.setHours(0, 0, 0, 0);
        }
        return newDate;
      };
  
      // Function to calculate percentage
      const calculatePercentage = (count, total) => total > 0 ? ((count / total) * 100).toFixed(2) : "0.00";
  
      let totalTATCount = 0;
      let totalComplaints = filteredComplaints.length;
      let monthlyReport = {};
      let yearlyReport = {};
  
      // Process complaints
      const complaintsWithTAT = filteredComplaints.map((c) => {
        const complaintDate = adjustDate(c.createdAt);
        const complaintCloseDate = c.complaintCloseTime ? new Date(c.complaintCloseTime) : null;
        const assignTime = c.assignServiceCenterTime ? new Date(c.assignServiceCenterTime) : null;
        const responseTime = c.empResponseTime ? new Date(c.empResponseTime) : null;
  
        const monthYear = complaintDate.toLocaleString("default", { month: "long", year: "numeric" });
        const year = complaintDate.getFullYear();
  
        // Calculate CT, RT, and TAT
        let tat = getTimeDifference(complaintDate, complaintCloseDate);
        let ct = getTimeDifference(complaintDate, complaintCloseDate);
        let rt = getTimeDifference(complaintDate, complaintCloseDate);
  
        // Check if TAT ≤ 24 hours
        if (tat <= 24) totalTATCount++;
  
        // Update Monthly Report
        if (!monthlyReport[monthYear]) {
          monthlyReport[monthYear] = { complaints: [], tatCount: 0, totalComplaints: 0, totalCT: 0, totalRT: 0 };
        }
        monthlyReport[monthYear].complaints.push({ complaintId: c._id, ct, rt, tat });
        monthlyReport[monthYear].totalComplaints++;
        monthlyReport[monthYear].totalCT += ct;
        monthlyReport[monthYear].totalRT += rt;
        if (tat <= 24) monthlyReport[monthYear].tatCount++;
  
        // Update Yearly Report
        if (!yearlyReport[year]) {
          yearlyReport[year] = { complaints: [], tatCount: 0, totalComplaints: 0, totalCT: 0, totalRT: 0 };
        }
        yearlyReport[year].complaints.push({ c,complaintId: c._id, ct, rt, tat });
        yearlyReport[year].totalComplaints++;
        yearlyReport[year].totalCT += ct;
        yearlyReport[year].totalRT += rt;
        if (tat <= 24) yearlyReport[year].tatCount++;
  
        return { c,complaintId: c._id, ct, rt, tat };
      });
  
      // Calculate Overall TAT Percentage
      let overallTATPercentage = calculatePercentage(totalTATCount, totalComplaints);
  
      // Process final reports with TAT%, CT, RT averages
      const processReport = (report) => Object.keys(report).map((key) => {
        let { complaints, tatCount, totalComplaints, totalCT, totalRT } = report[key];
  
        return {
          period: key,
          tatPercentage: calculatePercentage(tatCount, totalComplaints),
          avgCT: (totalComplaints > 0 ? (totalCT / totalComplaints).toFixed(2) : "0.00") + " hrs",
          avgRT: (totalComplaints > 0 ? (totalRT / totalComplaints).toFixed(2) : "0.00") + " hrs",
          complaints, // Includes per-complaint CT, RT, TAT
        };
      });
  
      let finalMonthlyReport = processReport(monthlyReport);
      let finalYearlyReport = processReport(yearlyReport);
  
      console.log("📊 Overall TAT Percentage:", overallTATPercentage + "%");
      console.log("📊 Per-Complaint TAT, CT, RT:", complaintsWithTAT);
      console.log("📊 Monthly Report:", finalMonthlyReport);
      console.log("📊 Yearly Report:", finalYearlyReport);
    } catch (err) {
      console.log("Error fetching complaints:", err);
    }
  };
  
  
 
  
  const filterData = userData?.role === "ADMIN" ? complaint
    : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
        : userData?.role === "BRAND EMPLOYEE" ? complaint.filter((item) => item?.brandId === userData.brandId)
          : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
            : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
              : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
                : complaint;

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data);
  };

  const pieChartData = [
    ["Task", "Hours per Day"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Cancel", dashData?.complaints?.cancel],
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
    ["FinalVerification", dashData?.complaints?.finalVerification],
    ["In Progress", dashData?.complaints?.inProgress],
  ];

  const barChartData = [
    ["Complaint Status", "Count"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Cancel", dashData?.complaints?.cancel],
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
    ["FinalVerification", dashData?.complaints?.finalVerification],
    ["In Progress", dashData?.complaints?.inProgress],
  ];

  const options = {
    title: "Complaints Summary",
  };
  // console.log("dashData",dashData);

  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        {/* Additional Content */}
      </div>

      <div className='my-8'>
        <div className='grid grid-cols-4 gap-8 items-center  rounded-xl shadow-lg p-5'>
          <div onClick={() => router.push("/complaint/allComplaint")} className='flex justify-center  items-center '>
            <div className='w-full'>
              <div className='w-full bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.allComplaints} delay={1} />
              </div>
              <div className='text-center mt-2'>Total Service  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/close")} className='bg-green-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.complete} delay={1} />
              </div>
              <div className='text-center mt-2'>Close  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/assign")} className='bg-blue-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.assign} delay={1} />
              </div>
              <div className='text-center mt-2'>Assigned  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/inprogress")} className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.inProgress} delay={1} />
              </div>
              <div className='text-center mt-2'>In Progress</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/pending")} className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
              </div>
              <div className='text-center mt-2'>Pending  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/partpending")} className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.partPending} delay={1} />
              </div>
              <div className='text-center mt-2'>Part Pending </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/finalVerification")} className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.finalVerification} delay={1} />
              </div>
              <div className='text-center mt-2'>Final Verification </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push(`/complaint/pending/${"schedule"}`)} className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.scheduleUpcomming} delay={1} />
              </div>
              <div className='text-center mt-2'>  Schedule Today</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/scheduleUpcomming")} className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.schedule} delay={1} />
              </div>
              <div className='text-center mt-2'>Upcomming Schedule</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/cancel")} className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.cancel} delay={1} />
              </div>
              <div className='text-center mt-2'>Cancel </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/allComplaint")} className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.zeroToOneDays} delay={1} />
              </div>
              <div className='text-center mt-2'> 0-1 days service </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/allComplaint")} className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.twoToFiveDays} delay={1} />
              </div>
              <div className='text-center mt-2'> 2-5 days service </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div onClick={() => router.push("/complaint/allComplaint")} className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.moreThanFiveDays} delay={1} />
              </div>
              <div className='text-center mt-2'> More than Five Days  Service</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full'>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={averageCT} delay={1} /> {"%"}
              </div>
              <div className='text-center mt-2'> C T</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full' onClick={() => router.push("/user/brand/stickers")}>
              <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={warranty?.totalNumberOfGenerate} delay={1} />
              </div>

              <div className='text-center mt-2'>Product Stickers  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div className='w-full' onClick={() => router.push(`/profile/${userData?._id}`)}>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end= {((walletAmnt ) * 1.18).toFixed(2)} delay={1} />
              </div>
              <div className='text-center mt-2'>Wallet Amount</div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 my-8'>

        <div className='rounded-lg shadow px-4 py-4 bg-white'>
          <Chart
            chartType="PieChart"
            data={pieChartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>
        <div className='rounded-lg shadow px-4 py-4 bg-white'>
          <Chart
            chartType="BarChart"
            data={barChartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>
      </div>

      <div>
        <RecentServicesList data={filterData} userData={userData} />
      </div>
    </>
  );
};

export default BrandDashboard;
