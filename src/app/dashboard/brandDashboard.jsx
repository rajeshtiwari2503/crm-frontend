
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

  const calculateTAT = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    return (updated - created) / (1000 * 60 * 60); // Convert milliseconds to hours
  };



  const calculateBusinessHours = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    let start = new Date(startDate);
    let end = new Date(endDate);
    let totalHours = 0;

    const businessStartHour = 8;
    const businessEndHour = 18;

    while (start < end) {
      const day = start.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = start.getHours();

      if (day !== 0 && day !== 6 && hour >= businessStartHour && hour < businessEndHour) {
        totalHours++;
      }

      start.setHours(start.getHours() + 1);
    }

    return totalHours;
  };

  

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint");
      let { data } = response;
  
      const techComp = data.filter((item) => item?.brandId === userData._id);
      const filteredComplaints = techComp.filter(c =>
        ["COMPLETED", "FINAL VERIFICATION"].includes(c.status)
      );
  
      let monthlyReport = {};
      let yearlyReport = {};
      let complaintsData = [];
  
      const adjustDate = (date) => {
        let newDate = new Date(date);
        if (newDate.getHours() > 12) {
          newDate.setDate(newDate.getDate() + 1);
          newDate.setHours(0, 0, 0, 0);
        }
        return newDate;
      };
  
      filteredComplaints.forEach((c) => {
        const complaintDate = adjustDate(c.createdAt);
        const updatedDate = new Date(c.updatedAt);
        const assignServiceDate = c.assignServiceCenterTime ? new Date(c.assignServiceCenterTime) : null;
  
        const monthYear = complaintDate.toLocaleString("default", { month: "long", year: "numeric" });
        const year = complaintDate.getFullYear();
  
        if (!monthlyReport[monthYear]) {
          monthlyReport[monthYear] = { complaints: [], tatCount: 0, ctCount: 0, rtCount: 0 };
        }
        if (!yearlyReport[year]) {
          yearlyReport[year] = { complaints: [], tatCount: 0, ctCount: 0, rtCount: 0 };
        }
  
        let tat = (updatedDate - complaintDate) / (1000 * 60 * 60); // Convert to hours
        let ct = (updatedDate - new Date(c.createdAt)) / (1000 * 60 * 60);
        let rt = assignServiceDate ? (assignServiceDate - complaintDate) / (1000 * 60 * 60) : 0;
  
        tat = tat < 0 ? 0 : tat;
        ct = ct < 0 ? 0 : ct;
        rt = rt < 0 ? 0 : rt;
  
        if (rt > 2) rt = 0;
  
        const complaintDetails = {
          complaintId: c.complaintId,
          brandName: c.productBrand,
          serviceCenter: c.assignServiceCenter || "Not Assigned",
          status: c.status,
          tat: tat,
          ct: ct,
          rt: rt,
        };
  
        monthlyReport[monthYear].complaints.push(complaintDetails);
        yearlyReport[year].complaints.push(complaintDetails);
        complaintsData.push(complaintDetails);
  
        // **Count complaints that meet TAT and CT criteria**
        if (tat <= 24) monthlyReport[monthYear].tatCount++;
        if (ct <= 24) monthlyReport[monthYear].ctCount++;
        if (rt > 0) monthlyReport[monthYear].rtCount++;
  
        if (tat <= 24) yearlyReport[year].tatCount++;
        if (ct <= 24) yearlyReport[year].ctCount++;
        if (rt > 0) yearlyReport[year].rtCount++;
      });
  
      const calculatePercentage = (count, total) => {
        return total > 0 ? ((count / total) * 100).toFixed(2) : "0.00";
      };
  
      const processReport = (report) => {
        return Object.keys(report).map((key) => {
          let complaints = report[key].complaints;
          let totalComplaints = complaints.length;
          let tatCount = report[key].tatCount;
          let ctCount = report[key].ctCount;
          let rtCount = report[key].rtCount;
  
          return {
            period: key,
            tatPercentage: calculatePercentage(tatCount, totalComplaints),
            ctPercentage: calculatePercentage(ctCount, totalComplaints),
            rtPercentage: calculatePercentage(rtCount, totalComplaints),
            complaints
          };
        });
      };
  
      let finalMonthlyReport = processReport(monthlyReport);
      let finalYearlyReport = processReport(yearlyReport);
  
      console.log("📊 Monthly Report:", finalMonthlyReport);
      console.log("📊 Yearly Report:", finalYearlyReport);
    } catch (err) {
      console.log(err);
    }
  };
  



  // const getAllComplaint = async () => {
  //   try {
  //     let response = await http_request.get("/getAllComplaint");
  //     let { data } = response;

  //     const techComp = data.filter((item) => item?.brandId === userData._id);

  //     const filteredComplaints = techComp.filter(c =>
  //       ["COMPLETED", "FINAL VERIFICATION"].includes(c.status)
  //     );

  //     let monthlyReport = {};
  //     let yearlyReport = {};
  //     let totalTAT = [], totalCT = [], totalRT = [];
  //     let complaintsData = [];

  //     filteredComplaints.forEach((c) => {
  //       const complaintDate = new Date(c.createdAt);
  //       const monthYear = complaintDate.toLocaleString("default", { month: "long", year: "numeric" });
  //       const year = complaintDate.getFullYear();

  //       if (!monthlyReport[monthYear]) {
  //         monthlyReport[monthYear] = { complaints: [] };
  //       }
  //       if (!yearlyReport[year]) {
  //         yearlyReport[year] = { complaints: [] };
  //       }

  //       const tat = calculateBusinessHours(c.createdAt, c.updatedAt);
  //       const ct = calculateBusinessHours(c.assignServiceCenterTime, c.updatedAt);
  //       const rt = calculateBusinessHours(c.createdAt, c.assignServiceCenterTime);
  //       const finalRT = rt || 5;

  //       const complaintDetails = {
  //         complaintId: c.complaintId,
  //         brandName: c.productBrand,
  //         serviceCenter: c.assignServiceCenter || "Not Assigned",
  //         status: c.status,
  //         tat,
  //         ct,
  //         rt: finalRT, // Use corrected RT
  //       };
  //       // const complaintDetails = {
  //       //   _id: c._id,
  //       //   complaintId: c.complaintId,
  //       //   brandName: c.productBrand,
  //       //   serviceCenter: c.assignServiceCenter,
  //       //   status: c.status,
  //       //   tat,
  //       //   ct,
  //       //   rt
  //       // };

  //       monthlyReport[monthYear].complaints.push(complaintDetails);
  //       yearlyReport[year].complaints.push(complaintDetails);
  //       complaintsData.push(complaintDetails);

  //       totalTAT.push(tat);
  //       totalCT.push(ct);
  //       totalRT.push(rt);
  //     });

  //     const processReport = (report) => {
  //       return Object.keys(report).map((key) => {
  //         let complaints = report[key].complaints;
  //         let TATData = complaints.map(c => c.tat);
  //         let CTData = complaints.map(c => c.ct);
  //         let RTData = complaints.map(c => c.rt);

  //         let avgTAT = TATData.length ? (TATData.reduce((sum, tat) => sum + tat, 0) / TATData.length).toFixed(2) : 0;
  //         let avgCT = CTData.length ? (CTData.reduce((sum, ct) => sum + ct, 0) / CTData.length).toFixed(2) : 0;
  //         let avgRT = RTData.length ? (RTData.reduce((sum, rt) => sum + rt, 0) / RTData.length).toFixed(2) : 0;

  //         return {
  //           period: key,
  //           avgTAT: calculatePercentage(avgTAT),
  //           avgCT: calculatePercentage(avgCT),
  //           avgRT: calculatePercentage(avgRT),
  //           complaints
  //         };
  //       });
  //     };

  //     let finalMonthlyReport = processReport(monthlyReport);
  //     let finalYearlyReport = processReport(yearlyReport);

  //     let totalAvgTAT = totalTAT.length ? (totalTAT.reduce((sum, tat) => sum + tat, 0) / totalTAT.length).toFixed(2) : 0;
  //     let totalAvgCT = totalCT.length ? (totalCT.reduce((sum, ct) => sum + ct, 0) / totalCT.length).toFixed(2) : 0;
  //     let totalAvgRT = totalRT.length ? (totalRT.reduce((sum, rt) => sum + rt, 0) / totalRT.length).toFixed(2) : 0;

  //     let totalAverageReport = {
  //       avgTAT: calculatePercentage(totalAvgTAT),
  //       avgCT: calculatePercentage(totalAvgCT),
  //       avgRT: calculatePercentage(totalAvgRT),
  //       complaints: complaintsData
  //     };

  //     console.log("📊 Monthly Report:", finalMonthlyReport);
  //     console.log("📊 Yearly Report:", finalYearlyReport);
  //     console.log("📊 Total Average Report:", totalAverageReport);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  
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
