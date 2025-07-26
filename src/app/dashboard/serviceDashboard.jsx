 
import React, { useEffect, useState } from 'react';
import http_request from '../../../http-request'; // Assuming this is your API utility
import CountUp from 'react-countup'; // For counting animations
import { Chart } from 'react-google-charts'; // For charts
import RecentServicesList from '../complaint/RecentServices'; // Assuming this component displays recent services
 
import { useRouter } from 'next/navigation';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import { AccessTime, Assignment, AssignmentTurnedIn, Cancel, CurrencyRupee, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, ProductionQuantityLimits, QrCodeScanner, Settings, ShoppingBag, Wallet } from '@mui/icons-material';

const ServiceDashboard = (props) => {
  const router = useRouter();

  const userData = props?.userData; // Technician's user data
  const dashData = props?.dashData; // Dashboard data for counts and summaries
  const [complaint, setComplaint] = useState([]); // State to hold complaint data
  const [refresh, setRefresh] = useState(""); // State for triggering data refresh
  const [serviceDetails, setServiceDetails] = useState(""); // State for triggering data refresh
   // State for average TAT
   const [averageCT, setAverageCT] = useState(0);
    const [averageRT, setAverageRT] = useState(0);
    const [averageTAT, setAverageTAT] = useState(0);
  const [transactions, setTransactions] = useState([])

  const actualTAT = 12;
  const actualCT = 6;
  const actualRT = 3;
  const targetTAT = 24;
  const targetCT = 12;
  const targetRT = 6;
  // Fetch data when component mounts or refresh state changes
  useEffect(() => {
    getAllComplaint();
    // getWalletById();
    getTransactions()
    getOrderPriceAndDepositsByServiceCenter()
  }, [refresh]);
const getTransactions = async () => {
    try {
      const endPoint =   `/getAllServicePaymentByCenterId/${userData?._id}` 
 
      const response = await http_request.get(endPoint);
      
      let { data } = response;
      // console.log("data",data);
      
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      // setLoading(false);
    }
  };
const getOrderPriceAndDepositsByServiceCenter = async () => {
    try {
      
 
      const response = await http_request.get(`/getOrderPriceAndDepositsByServiceCenter/${userData?._id}`);
      
      let { data } = response;
      // console.log("data",data);
      
      setServiceDetails(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      // setLoading(false);
    }
  };

// console.log("serviceDetails",serviceDetails);


  const totals = transactions.reduce((acc, item) => {
    const amount = parseFloat(item.payment); // Convert string to number
    if (item.status === "PAID") {
        acc.totalPaid += amount;
    } else if (item.status === "UNPAID") {
        acc.totalUnpaid += amount;
    }
    return acc;
}, { totalPaid: 0, totalUnpaid: 0 });
  // const getWalletById = async () => {
  //   try {
  //     let response = await http_request.get(`/getWalletByCenterId/${userData?._id}`);
  //     let { data } = response;
  //     setWallet(data)

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get(`/getAllTatByServiceCenter?assignServiceCenterId=${userData?._id}`);
      let { data } = response;
      // console.log("data",data);
      
  setAverageTAT(data?.overallTATPercentage)
  setAverageRT(data?.overallRTPercentage)
  setAverageCT(data?.overallCTPercentage)
      
    } catch (err) {
      console.log("Error fetching complaints:", err);
    }
  };
  
  // const getAllComplaint = async () => {
  //   try {
  //     let response = await http_request.get("/getAllComplaint");
  //     let { data } = response;
  //     setComplaint(data?.data);
  
  //     // Filter complaints for the brand and required statuses
  //     const filteredComplaints = data?.data?.filter(
  //       (item) =>
  //         item?.assignServiceCenterId === userData._id &&
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
  //       const responseTime = c.serviceCenterResponseTime
  //         ? new Date(c.serviceCenterResponseTime)
  //         : null;
  //       const serviceStartTime = c.assignServiceCenterTime
  //         ? new Date(c.assignServiceCenterTime)
  //         : null;
  //       const serviceCompletionTime = c.complaintCloseTime
  //         ? new Date(c.complaintCloseTime)
  //         : null;
  
  //       // ** Debugging logs **
  //       // console.log("📝 Complaint ID:", c._id);
  //       // console.log("Created At:", complaintDate.toISOString());
  //       // console.log(
  //       //   "Response Time:",
  //       //   responseTime ? responseTime.toISOString() : "N/A"
  //       // );
  
  //       const monthYear = complaintDate.toLocaleString("default", {
  //         month: "long",
  //         year: "numeric",
  //       });
  //       const year = complaintDate.getFullYear();
  
  //       // Calculate TAT, RT, and CT
  //       let tat = getTimeDifference(complaintDate, complaintCloseDate);
  //       let rt = getTimeDifference(serviceStartTime,  responseTime);
  //       let ct = getTimeDifference(complaintDate, complaintCloseDate);
  
  //       // console.log(`🕒 RT: ${rt.days} days, ${rt.hours} hours`);
  
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
  //     console.log("📊 Per-Complaint TAT, CT, RT:complaintsWithMetrics", complaintsWithMetrics);
  //     console.log("📊 Monthly Report:", finalMonthlyReport);
  //     console.log("📊 Yearly Report:", finalYearlyReport);
  //   } catch (err) {
  //     console.log("Error fetching complaints:", err);
  //   }
  // };
  // console.log("complaint",complaint);
  
  // Filter complaints based on user role for displaying in the list
  const filterData = userData?.role === "ADMIN" ? complaint
    : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
        : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
          : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
            : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
              : complaint;

  // Add index to filtered data for rendering purposes
  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));
  // Function to trigger data refresh
  const RefreshData = (data) => {
    setRefresh(data);
  };

  // Data for Pie Chart
  const pieChartData = [
    ["Task", "Hours per Day"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Cancel", dashData?.complaints?.cancel],
    ["customerSidePending", data?.complaints?.customerSidePending],
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
    ["InProgress", dashData?.complaints?.inProgress],
  ];

  // Data for Bar Chart
  const barChartData = [
    ["Complaint Status", "Count"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Complete", dashData?.complaints?.complete],
    ["customerSidePending", data?.complaints?.customerSidePending],
    ["Cancel", dashData?.complaints?.cancel],
    ["PartPending", dashData?.complaints?.partPending],
    ["InProgress", dashData?.complaints?.inProgress],
  ];

  // Options for charts
  const options = {
    title: "Complaints Summary",
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0. } },
    pieSliceText: "value",
    // pieSliceText: "label",
    legend: { position: "right" },
  };



  const prepareChartData = (timeframe) => {
    const timeframeData = dashData && dashData?.complaints[timeframe];
    return [
      ['Status', 'Count'],
      ['AllComplaints', timeframeData?.allComplaints],
      ['InProgress', timeframeData?.inProgress],
      ['Assign', timeframeData?.assign],
      ['Pending', timeframeData?.pending],
      ['Complete', timeframeData?.complete],
      ['Cancel', timeframeData?.cancel],
      ['PartPending', timeframeData?.partPending],
    ];
  };
  const handleWallet = async () => {
    try {
      const resData = { serviceCenterId: userData?._id, serviceCenterName: userData?.serviceCenterName }

      let response = await http_request.post("/addWallet", resData)
      let { data } = response
      ToastMessage(data)
      setRefresh(data)
    }
    catch (err) {
      console.log(err);
    }
  }
// console.log("dashData",dashData);

  return (
    <div className='   '>
       
      <Toaster />

     
      <div className='mb-10'>
        <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Complaints</div>

        <div className='grid md:grid-cols-5 grid-cols-1 gap-4  '>
          <div className=' '>
            <div onClick={() => router.push("/complaint/pending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/inprogress")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/assign")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/partpending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/customerSidePending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          
          <div className=' '>
            <div onClick={() => router.push("/complaint/scheduleUpcomming")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/cancel")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/finalVerification")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push("/complaint/close")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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



          <div className=' '>
            <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
                    <div onClick={() => router.push(`/complaint/todayCloseComplaint`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
          
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
                    <div onClick={() => router.push(`/complaint/todayCreateComplaint`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
          
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

        <div className=' h-8  md:col-span-4 col-span-1 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Pending Complaints</div>

        <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4'>
          <div className=' '>
            <div onClick={() => router.push(`/complaint/pending/${"0-1"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

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
          <div className=' '>
            <div onClick={() => router.push(`/complaint/pending/${"2-5"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

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
          <div className=' '>
            <div onClick={() => router.push(`/complaint/pending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>more than 5 days</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.moreThanFiveDays} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' '>
            <div onClick={() => router.push(`/complaint/pending/${"schedule"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

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
          {/* <div className=' '>
            <div onClick={() => router.push(`/complaint/close`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

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
        <div className=' h-8  md:col-span-4 col-span-1 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Part Pending Complaints</div>

        <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4'>
        
          <div className=' '>
            <div onClick={() => router.push(`/complaint/partpending/${"0-1"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push(`/complaint/partpending/${"2-5"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
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
          <div className=' '>
            <div onClick={() => router.push(`/complaint/partpending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Settings fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>more than 5 days</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.moreThanFiveDaysPartPending} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' h-8  md:col-span-5 col-span-1 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Other details</div>

           
            
          <div className=' '>
            <div   className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Wallet fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Paid Amount</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={totals.totalPaid} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' '>
            <div  className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Wallet fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Unpaid Amount</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={totals.totalUnpaid} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' '>
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
          <div className=' '>
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
          <div className=' '>
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
        <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Other Details </div>
             <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4 mb-5 '>
               <div className=''>
                 <div onClick={() => router.push(`/profile/${userData?._id}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <CurrencyRupee fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>  Deposite Amount </div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={serviceDetails?.totalDeposit} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
                <div className=''>
                 <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <CurrencyRupee fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>  Sparepart Amount </div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={Math.max(0, (serviceDetails?.totalOrderPrice || 0) - (serviceDetails?.totalStockPrice || 0))} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
                 <div className=''>
                          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                            <div className='flex justify-between'>
                            </div>
                            <div className='pl-5 py-1 flex justify-between items-center'>
                              <div className='flex items-center'>
                                <CurrencyRupee fontSize='medium' />
                                <div className='ml-2'>
                                  <div className='text-blue-500 font-semibold'>Return  Sparepart Amount </div>
                                  <div className=' text-2xl font-semibold'>
                                    <CountUp start={0} end={serviceDetails?.totalStockPrice} delay={1} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
               <div className=''>
                 <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <ShoppingBag fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>Approved</div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={serviceDetails?.approvedOrderCount} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className=''>
                 <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <ShoppingBag fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>Not Approved</div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={serviceDetails?.notApprovedOrderCount} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
                <div className=''>
                 <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <ShoppingBag fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>Cancel Order</div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={serviceDetails?.canceledOrderCount} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className=''>
                 <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
                   <div className='flex justify-between'>
                   </div>
                   <div className='pl-5 py-1 flex justify-between items-center'>
                     <div className='flex items-center'>
                       <ShoppingBag fontSize='medium' />
                       <div className='ml-2'>
                         <div className='text-blue-500 font-semibold'>Total Orders</div>
                         <div className=' text-2xl font-semibold'>
                           <CountUp start={0} end={serviceDetails?.totalOrders} delay={1} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
       
             </div>

      {/* Display charts for visualization */}
      <div className='grid md:grid-cols-2 grid-cols-1 md:gap-4'>
        {/* Example: Pie Chart */}
        <div className='bg-gray-200 rounded-xl shadow-lg p-5 mb-8'>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType='PieChart'
            loader={<div>Loading Chart</div>}
            data={pieChartData}
            options={options}
            legendToggle
          />
        </div>

        {/* Example: Bar Chart */}
        <div className='bg-gray-200 rounded-xl shadow-lg p-5 mb-8'>
          <Chart
            chartType="BarChart"
            data={barChartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>

      </div>
      <div className=' grid md:grid-cols-2 grid-cols-1  gap-4 items-center bg-sky-100 rounded-xl shadow-lg mb-8 md:p-5'>
        <div>
          <h2 className='mb-5'>Monthly Complaints</h2>
          <Chart
            chartType="PieChart"
            width="100%"
            options={options}
            height="400px"
            data={prepareChartData('lastMonth')}
          />
        </div>
        <div>
          <h2 className='mb-5'>Weekly Complaints</h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={prepareChartData('lastWeek')}
          />
        </div>
        <div >
          <h2 className='mb-5'>Daily Complaints</h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={prepareChartData('daily')}
          />
        </div>
      </div>
      {/* Display recent services list */}
      <div className="mt-8 flex justify-center ">
      <div className="  md:w-full w-[260px] ">
        <RecentServicesList data={data} userData={props?.userData}/>
      </div>
      </div>

      {/* Include other components or sections as required */}
    </div>
  );
};

export default ServiceDashboard;
