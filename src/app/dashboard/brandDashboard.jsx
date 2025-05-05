
import React, { useEffect, useState } from 'react';

import http_request from '../../../http-request';

import CountUp from 'react-countup';

import { AccessTime, Assignment, AssignmentTurnedIn, Cancel, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, ProductionQuantityLimits, QrCodeScanner, Settings, ShoppingBag, Wallet } from '@mui/icons-material'
import { Chart } from 'react-google-charts';
import RecentServicesList from '../complaint/RecentServices';
import { useRouter } from 'next/navigation';

import SearchComplaintList from '../complaint/allComplaint/dashboardComplaint';


const BrandDashboard = (props) => {

  const router = useRouter()

  const userData = props?.userData;
  const dashData = props?.dashData;
  // console.log("userData",userData);

  const [brandData, setBrandData] = useState([]);
  const [complaint, setComplaint] = useState([]);
  const [warranty, setWarranty] = useState(0);
  const [refresh, setRefresh] = useState("");
  const [averageCT, setAverageCT] = useState(0);
  const [averageRT, setAverageRT] = useState(0);
  const [averageTAT, setAverageTAT] = useState(0);
  const [walletAmnt, setWalletAmnt] = useState(0);


  useEffect(() => {
    getAllComplaint();
    getWarrantyById()
    getWalletAmountById()
    getAllProductWarrantyByBrandStickers()
  }, [refresh]);



  const getAllProductWarrantyByBrandStickers = async () => {
    try {
      let response = await http_request.get("/getAllProductWarrantyByBrandStickers")
      let { data } = response;
      // console.log("data", data);

      setBrandData(data?.data)
    }
    catch (err) {
      console.log(err);

    }
  }
  const brandStickers = brandData?.find((f) => f?.brandId === userData?._id)

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
  //     setComplaint(data?.data);

  //     // Filter complaints for the brand and required statuses
  //     const filteredComplaints = data?.data?.filter(
  //       (item) =>
  //         item?.brandId === userData._id &&
  //         ["COMPLETED", "FINAL VERIFICATION"].includes(item.status)&&
  //               item?.cspStatus === "NO"
  //     );

  //     // Function to calculate time difference in hours and days
  //     const getTimeDifference = (start, end) => {
  //       if (!start || !end) return { days: 0, hours: 0 };
  //       let diffMs = new Date(end) - new Date(start);
  //       let totalHours = Math.max(diffMs / (1000 * 60 * 60), 0);
  //       let days = Math.floor(totalHours / 24);
  //       let hours = Math.round(totalHours % 24);
  //       return { days, hours };
  //     };

  //     // Function to calculate percentage
  //     const calculatePercentage = (count, total) =>
  //       total > 0 ? ((count / total) * 100).toFixed(2) : "0.00";

  //     let totalTATCount = 0;
  //     let totalRTCount = 0;
  //     let totalCTCount = 0;
  //     let totalComplaints = filteredComplaints.length;

  //     let monthlyReport = {};
  //     let yearlyReport = {};

  //     // Process complaints
  //     const complaintsWithMetrics = filteredComplaints.map((c) => {
  //       const complaintDate = new Date(c.createdAt);
  //       const complaintCloseDate = c.complaintCloseTime
  //         ? new Date(c.complaintCloseTime)
  //         : null;
  //       const responseTime = c.empResponseTime
  //         ? new Date(c.empResponseTime)
  //         : null;
  //       const serviceStartTime = c.assignServiceCenterTime
  //         ? new Date(c.assignServiceCenterTime)
  //         : null;
  //       const serviceCompletionTime = c.complaintCloseTime
  //         ? new Date(c.complaintCloseTime)
  //         : null;

  //       // ** Debugging logs **
  //       console.log("📝 Complaint ID:", c._id);
  //       console.log("Created At:", complaintDate.toISOString());
  //       console.log(
  //         "Response Time:",
  //         responseTime ? responseTime.toISOString() : "N/A"
  //       );

  //       const monthYear = complaintDate.toLocaleString("default", {
  //         month: "long",
  //         year: "numeric",
  //       });
  //       const year = complaintDate.getFullYear();

  //       // Calculate TAT, RT, and CT
  //       let tat = getTimeDifference(complaintDate, complaintCloseDate);
  //       let rt = getTimeDifference(complaintDate, responseTime);
  //       let ct = getTimeDifference(complaintDate, complaintCloseDate);

  //       console.log(`🕒 RT: ${rt.days} days, ${rt.hours} hours`);

  //       // Check if TAT, RT, and CT ≤ threshold
  //       if (tat.days === 0 && tat.hours <= 24) totalTATCount++;
  //       if (rt.days === 0 && rt.hours <= 2) totalRTCount++;
  //       if (ct.days === 0 && ct.hours <= 24) totalCTCount++;

  //       // Update Monthly Report
  //       if (!monthlyReport[monthYear]) {
  //         monthlyReport[monthYear] = {
  //           complaints: [],
  //           tatCount: 0,
  //           rtCount: 0,
  //           ctCount: 0,
  //           totalComplaints: 0,
  //           totalCT: 0,
  //           totalRT: 0,
  //         };
  //       }
  //       monthlyReport[monthYear].complaints.push({
  //         complaintId: c._id,
  //         ct,
  //         rt,
  //         tat,
  //       });
  //       monthlyReport[monthYear].totalComplaints++;
  //       monthlyReport[monthYear].totalCT += ct.days * 24 + ct.hours;
  //       monthlyReport[monthYear].totalRT += rt.days * 24 + rt.hours;
  //       if (tat.days === 0 && tat.hours <= 24) monthlyReport[monthYear].tatCount++;
  //       if (rt.days === 0 && rt.hours <= 2) monthlyReport[monthYear].rtCount++;
  //       if (ct.days === 0 && ct.hours <= 24) monthlyReport[monthYear].ctCount++;

  //       // Update Yearly Report
  //       if (!yearlyReport[year]) {
  //         yearlyReport[year] = {
  //           complaints: [],
  //           tatCount: 0,
  //           rtCount: 0,
  //           ctCount: 0,
  //           totalComplaints: 0,
  //           totalCT: 0,
  //           totalRT: 0,
  //         };
  //       }
  //       yearlyReport[year].complaints.push({
  //         complaintId: c._id,
  //         ct,
  //         rt,
  //         tat,
  //       });
  //       yearlyReport[year].totalComplaints++;
  //       yearlyReport[year].totalCT += ct.days * 24 + ct.hours;
  //       yearlyReport[year].totalRT += rt.days * 24 + rt.hours;
  //       if (tat.days === 0 && tat.hours <= 24) yearlyReport[year].tatCount++;
  //       if (rt.days === 0 && rt.hours <= 2) yearlyReport[year].rtCount++;
  //       if (ct.days === 0 && ct.hours <= 24) yearlyReport[year].ctCount++;

  //       return { complaintId: c._id, ct, rt, tat };
  //     });

  //     // Calculate Overall Percentages
  //     let overallTATPercentage = calculatePercentage(totalTATCount, totalComplaints);
  //     let overallRTPercentage = calculatePercentage(totalRTCount, totalComplaints);
  //     let overallCTPercentage = calculatePercentage(totalCTCount, totalComplaints);

  //     // Process final reports with TAT%, CT, RT averages
  //     const processReport = (report) =>
  //       Object.keys(report).map((key) => {
  //         let {
  //           complaints,
  //           tatCount,
  //           rtCount,
  //           ctCount,
  //           totalComplaints,
  //           totalCT,
  //           totalRT,
  //         } = report[key];

  //         return {
  //           period: key,
  //           tatPercentage: calculatePercentage(tatCount, totalComplaints),
  //           rtPercentage: calculatePercentage(rtCount, totalComplaints),
  //           ctPercentage: calculatePercentage(ctCount, totalComplaints),
  //           avgCT:
  //             (totalComplaints > 0 ? (totalCT / totalComplaints).toFixed(2) : "0.00") +
  //             " hrs",
  //           avgRT:
  //             (totalComplaints > 0 ? (totalRT / totalComplaints).toFixed(2) : "0.00") +
  //             " hrs",
  //           complaints, // Includes per-complaint CT, RT, TAT
  //         };
  //       });

  //     let finalMonthlyReport = processReport(monthlyReport);
  //     let finalYearlyReport = processReport(yearlyReport);
  // setAverageTAT(overallTATPercentage)
  // setAverageRT(overallRTPercentage)
  // setAverageCT(overallCTPercentage)
  //     console.log("📊 Overall TAT Percentage:", overallTATPercentage + "%");
  //     console.log("📊 Overall RT Percentage:", overallRTPercentage + "%");
  //     console.log("📊 Overall CT Percentage:", overallCTPercentage + "%");
  //     console.log("📊 Per-Complaint TAT, CT, RT:", complaintsWithMetrics);
  //     console.log("📊 Monthly Report:", finalMonthlyReport);
  //     console.log("📊 Yearly Report:", finalYearlyReport);
  //   } catch (err) {
  //     console.log("Error fetching complaints:", err);
  //   }
  // };

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get(`/getAllTatByBrand?brandId=${userData?._id}`);
      let { data } = response;
      // console.log("data",data);

      setAverageTAT(data?.overallTATPercentage)
      setAverageRT(data?.overallRTPercentage)
      setAverageCT(data?.overallCTPercentage)

    } catch (err) {
      console.log("Error fetching complaints:", err);
    }
  };



  const filterData = userData?.role === "ADMIN" ? complaint
    : userData?.role === "BRAND" ? complaint?.filter((item) => item?.brandId === userData?._id)
      : userData?.role === "USER" ? complaint?.filter((item) => item?.userId === userData?._id)
        : userData?.role === "BRAND EMPLOYEE" ? complaint?.filter((item) => item?.brandId === userData.brandId)
          : userData?.role === "SERVICE" ? complaint?.filter((item) => item?.assignServiceCenterId === userData._id)
            : userData?.role === "TECHNICIAN" ? complaint?.filter((item) => item?.technicianId === userData._id)
              : userData?.role === "DEALER" ? complaint?.filter((item) => item?.dealerId === userData._id)
                : complaint;

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));
  // console.log("fil",filterData);

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
    ["customerSidePending", data?.complaints?.customerSidePending],
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
    ["customerSidePending", data?.complaints?.customerSidePending],
    ["PartPending", dashData?.complaints?.partPending],
    ["FinalVerification", dashData?.complaints?.finalVerification],
    ["In Progress", dashData?.complaints?.inProgress],
  ];

  const options = {
    title: "Complaints Summary",
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0. } },
    pieSliceText: "value",
    // pieSliceText: "label",
    legend: { position: "right" },
  };
  // console.log("dashData",dashData);


  return (
    <>
      <div className='mb-5 bg-[#e2e2e3] px-4 py-4 rounded-xl'>
        {/* Additional Content */}
        <SearchComplaintList userData={userData} />
      </div>

      <div className=''>
        {/* <div className='grid grid-cols-4 gap-8 items-center  rounded-xl shadow-lg p-5'>
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
        </div> */}
        <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Complaints</div>

        <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4'>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(
              `/complaint/pending?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`
            )} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Pending</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/inprogress?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Pending fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>In Progress</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.inProgress} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/assign?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <AssignmentTurnedIn fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Assign</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.assign} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/partpending?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Part Pending</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.partPending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/customerSidePending?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Customer Side Pending</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.customerSidePending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/allComplaint?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Total Pending</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.partPending + dashData?.complaints?.inProgress + dashData?.complaints?.pending + dashData?.complaints?.assign + dashData?.complaints?.customerSidePending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/scheduleUpcomming?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>  Upcomming Schedule</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.schedule} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/cancel?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Cancel fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Cancel</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.cancel} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/finalVerification?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <FactCheck fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Final Verification</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.finalVerification} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/close?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <AssignmentTurnedIn fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Close</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.complete} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/allComplaint?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Assignment fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Total Complaints</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.allComplaints} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
             <div className=''>
                    <div onClick={() => router.push(`/complaint/todayCloseComplaint?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
          
                      <div className='pl-5 py-1 flex justify-between items-center'>
                        <div className='flex items-center'>
                          <AssignmentTurnedIn fontSize='medium' />
                          <div className='ml-2'>
                            <div className='text-blue-500 font-semibold'>Today completed</div>
                            <div className=' text-2xl font-semibold'>
                              <CountUp start={0} end={dashData?.complaints?.completedToday} delay={1} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    <div onClick={() => router.push(`/complaint/todayCreateComplaint?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
          
                      <div className='pl-5 py-1 flex justify-between items-center'>
                        <div className='flex items-center'>
                          <Assignment fontSize='medium' />
                          <div className='ml-2'>
                            <div className='text-blue-500 font-semibold'>Today created</div>
                            <div className=' text-2xl font-semibold'>
                              <CountUp start={0} end={dashData?.complaints?.createdToday} delay={1} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
        </div>

        <div className=' h-8 col-span-4 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Pending Complaints</div>

        <div className='grid grid-cols-5 gap-4'>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/pending/${"0-1"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center justify-between'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>0-1 day</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.zeroToOneDays} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/pending/${"2-5"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>2-5 Days</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.twoToFiveDays} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/pending/${"more-than-week"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>more than week</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.moreThanFiveDays} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/pending/${"schedule"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center justify-between'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Schedule   Today</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.scheduleUpcomming} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/todayCloseComplaint?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Today completed</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.completedToday} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className=' h-8 col-span-4 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Part Pending Complaints</div>

        <div className='grid grid-cols-5 gap-4'>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/partpending/${"0-1"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>0-1 day</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.zeroToOneDaysPartPending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/partpending/${"2-5"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>2-5 Days</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.twoToFiveDaysPartPending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push(`/complaint/partpending/${"more-than-week"}?role=${encodeURIComponent(userData?.role)}&brandId=${encodeURIComponent(userData?._id)}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>more than week</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.moreThanFiveDaysPartPending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' h-8 col-span-5 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>  Other details</div>

          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div onClick={() => router.push("/user/brand/stickers")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <QrCodeScanner fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Product Stickers </div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={warranty?.totalNumberOfGenerate} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {brandStickers ? ""
            : <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
              <div onClick={() => router.push(`/profile/${userData?._id}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                <div className='flex justify-between'>
                </div>
                <div className='pl-5 py-1 flex justify-between items-center'>
                  <div className='flex items-center'>
                    <Wallet fontSize='medium' />
                    <div className='ml-2'>
                      <div className='text-blue-500 font-semibold'>Wallet Amount</div>
                      <div className=' text-2xl font-semibold'>
                        <CountUp start={0} end={((walletAmnt) * 1.18).toFixed(2)} delay={1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <AccessTime fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>R T</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={averageRT} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <AccessTime fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>C T</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={averageCT} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
            <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <AccessTime fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>TAT</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={averageTAT} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
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

      <div className='flex justify-center'>
        <RecentServicesList data={data} userData={userData} />
      </div>
    </>
  );
};

export default BrandDashboard;
