import React, { useEffect, useState } from 'react';
import http_request from '../../../http-request'; // Assuming this is your API utility
import CountUp from 'react-countup'; // For counting animations
import { Chart } from 'react-google-charts'; // For charts
import RecentServicesList from '../complaint/RecentServices'; // Assuming this component displays recent services
import { AccessTime, Assignment, AssignmentTurnedIn, Cancel, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, ProductionQuantityLimits, QrCodeScanner, Settings, ShoppingBag, Wallet } from '@mui/icons-material';

const TechnicianDashboard = (props) => {
  const userData = props?.userData; // Technician's user data
  const dashData = props?.dashData; // Dashboard data for counts and summaries
  const [complaint, setComplaint] = useState([]); // State to hold complaint data
  const [refresh, setRefresh] = useState(""); // State for triggering data refresh
   // State for average TAT
  const [averageClosingTime, setAverageClosingTime] = useState(0); // State for average closing time (CT)
  const [averageResponseTime, setAverageResponseTime] = useState(0); // State for average response time (RT)
  const [tatPercentage, setTatPercentage] = useState(0); // State for TAT percentage
  const [ctPercentage, setCtPercentage] = useState(0); // State for CT percentage
  const [rtPercentage, setRtPercentage] = useState(0); // State for RT percentage
 const [averageCT, setAverageCT] = useState(0);
    const [averageRT, setAverageRT] = useState(0);
    const [averageTAT, setAverageTAT] = useState(0);

  const actualTAT = 12;
  const actualCT = 6;
  const actualRT = 3;
  const targetTAT = 24;
  const targetCT = 12;
  const targetRT = 6;
  // Fetch data when component mounts or refresh state changes
  useEffect(() => {
    getAllComplaint();
  }, [refresh]);

  // Function to calculate TAT in hours from created and updated timestamps
  const calculateTAT = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    return (updated - created) / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  // Function to calculate CT in hours from assign and update timestamps
  const calculateCT = (assignTime, updateTime) => {
    const assignDate = new Date(assignTime);
    const updateDate = new Date(updateTime);
    return (updateDate - assignDate) / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  // Function to fetch all complaints for the technician
  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint"); // Assuming endpoint to fetch complaints
      let { data } = response;

      // Filter complaints assigned to this technician
      const techComp = data?.data?.filter((item) => item?.technicianId === userData._id);

      // Filter completed complaints for TAT calculation
      const completedComplaints1 = techComp.filter(c => c.status === 'COMPLETED');
      const tatData = completedComplaints1.map(c => calculateTAT(c.createdAt, c.updatedAt));
      const totalTAT = tatData.reduce((sum, tat) => sum + tat, 0);
      const avgTAT = tatData.length ? (totalTAT / tatData.length).toFixed(2) : 0;

      const tat = avgTAT <= 24 ? "100" : avgTAT <= 32 ? "80" : avgTAT <= 48 ? "60" : avgTAT <= 64 ? "40" : avgTAT <= 72 ? "30" : avgTAT <= 100 ? "10" : "5"

      setAverageTAT(tat);

      // Filter completed complaints with valid assign and update times for CT calculation
      const completedComplaints = techComp.filter(c =>
        c.status === 'COMPLETED' &&
        c.assignTechnicianTime &&
        c.updatedAt &&
        !isNaN(new Date(c.assignTechnicianTime)) &&
        !isNaN(new Date(c.updatedAt))
      );

      const ctData = completedComplaints.map(c => calculateCT(c.assignTechnicianTime, c.updatedAt));
      const totalCT = ctData.reduce((sum, tat) => sum + tat, 0);
      const avgCT = ctData.length ? (totalCT / ctData.length).toFixed(2) : 0;
      const ct = avgCT <= 3 ? "100" : avgCT <= 6 ? "80" : avgCT <= 8 ? "60" : avgCT <= 12 ? "40" : avgCT <= 17 ? "30" : avgCT <= 24 ? "10" : "5"
      const rt = avgCT <= 3 ? "100" : avgCT <= 6 ? "80" : avgCT <= 8 ? "60" : avgCT <= 12 ? "40" : avgCT <= 17 ? "30" : avgCT <= 24 ? "10" : "5"
      setAverageClosingTime(ct);
      setAverageResponseTime(rt);

      // Calculate TAT percentage
      const tatPercent = completedComplaints1.length ? (avgTAT / targetTAT) * 100 : 0;
      setTatPercentage(tatPercent.toFixed(2));

      // Calculate CT percentage
      const ctPercent = completedComplaints?.length ? (avgCT / targetCT) * 100 : 0;
      setCtPercentage(ctPercent.toFixed(2));

      // Calculate RT percentage
      const rtPercent = completedComplaints.length ? (avgCT / targetRT) * 100 : 0;
      setRtPercentage(rtPercent.toFixed(2));

      setComplaint(data?.data); // Store all fetched complaints
    } catch (err) {
      console.log(err); // Handle errors if any
    }
  };

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
    ["PartPending", dashData?.complaints?.partPending],
    ["InProgress", dashData?.complaints?.inProgress],
  ];

  // Options for charts
  const options = {
    title: "Complaints Summary",
  };

  return (
    <>
      {/* Render additional content or sections as needed */}

      {/* Display summary statistics */}
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
            <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <PendingActions fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'>Total Pending</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.partPending + dashData?.complaints?.inProgress + dashData?.complaints?.pending + dashData?.complaints?.assign} delay={1} />
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
                    <div className='text-blue-500 font-semibold'>more than week</div>
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
          <div className=' '>
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
          </div>
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
                    <div className='text-blue-500 font-semibold'>more than week</div>
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
                    <div className='text-blue-500 font-semibold'>Wallet Amount</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.walletAmount} delay={1} />
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
                    <div className='text-blue-500 font-semibold'>Pay Amount</div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={dashData?.complaints?.totalAmount} delay={1} />
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

      {/* Display charts for visualization */}
      <div className='grid md:grid-cols-2 grid-cols-1 gap-4 '>
        {/* Example: Pie Chart */}
        <div className='bg-gray-200 rounded-xl shadow-lg p-5'>
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
        <div className='bg-gray-200 rounded-xl shadow-lg p-5'>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType='BarChart'
            loader={<div>Loading Chart</div>}
            data={barChartData}
            options={options}
          />
        </div>
      </div>

      {/* Display recent services list */}
      {props?.performance === true ? ""
        :   <div className="mt-8 flex justify-center ">
      <div className="  md:w-full w-[260px] ">
          <RecentServicesList data={data} userData={props?.userData}/>
        </div>
        </div>
      }
      {/* Include other components or sections as required */}
    </>
  );
};

export default TechnicianDashboard;
