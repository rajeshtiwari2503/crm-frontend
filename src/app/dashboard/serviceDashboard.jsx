// import React, { useEffect, useState } from 'react';

// import http_request from '../../../http-request';

// import CountUp from 'react-countup';


// import { Chart } from 'react-google-charts';
// import RecentServicesList from '../complaint/RecentServices';



// const ServiceDashboard = (props) => {
//   const userData = props?.userData;
//   const dashData = props?.dashData;
//   const [complaint, setComplaint] = useState([]);
//   const [refresh, setRefresh] = useState("");

//   useEffect(() => {
//     getAllComplaint();
//   }, [refresh]);

//   const getAllComplaint = async () => {
//     try {
//       let response = await http_request.get("/getAllComplaint");
//       let { data } = response;

//       setComplaint(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const filterData = userData?.role === "ADMIN" ? complaint
//     : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
//       : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
//         : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
//           : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
//             : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
//               : complaint;

//   const sortedData = filterData?.map((item, index) => ({ ...item, i: index + 1 }));
//   const data = sortedData?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

//   const RefreshData = (data) => {
//     setRefresh(data);
//   };

//   const pieChartData = [
//     ["Task", "Hours per Day"],
//     ["AllComplaints", dashData?.complaints?.allComplaints],
//     ["Assign", dashData?.complaints?.assign],
//     ["Pending", dashData?.complaints?.pending],
//     ["Complete", dashData?.complaints?.complete],
//     ["PartPending", dashData?.complaints?.partPending],
//     ["InProgress", dashData?.complaints?.inProgress],
//   ];

//   const barChartData = [
//     ["Complaint Status", "Count"],
//     ["AllComplaints", dashData?.complaints?.allComplaints],
//     ["Assign", dashData?.complaints?.assign],
//     ["Pending", dashData?.complaints?.pending],
//     ["Complete", dashData?.complaints?.complete],
//     ["PartPending", dashData?.complaints?.partPending],
//     ["InProgress", dashData?.complaints?.inProgress],

//   ];

//   const options = {
//     title: "Complaint Summary",
//   };

//   const prepareChartData = (timeframe) => {
//     const timeframeData = dashData&& dashData?.complaints[timeframe];
//     return [
//       ['Status', 'Count'],
//       ['AllComplaints', timeframeData?.allComplaints],
//       ['InProgress', timeframeData?.inProgress],
//       ['Assign', timeframeData?.assign],
//       ['Pending', timeframeData?.pending],
//       ['Complete', timeframeData?.complete],
//       ['Cancel', timeframeData?.cancel],
//       ['PartPending', timeframeData?.partPending],
//     ];
//   };
//   return (
//     <>
//       <div className='grid grid-cols-2 gap-4'>
//         {/* Additional Content */}
//       </div>

//       <div className='my-8'>
//       <div className='grid grid-cols-5 gap-4 items-center bg-sky-100 rounded-xl shadow-lg p-5'>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.allComplaints} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Total Service  </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.complete} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Completed  </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.assign} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Assigned  </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.inProgress} delay={1} />
//               </div>
//               <div className='text-center mt-2'>In Progress </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Part Pending  </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Pending  </div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={1} delay={1} />
//               </div>
//               <div className='text-center mt-2'>RT</div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={1} delay={1} />
//               </div>
//               <div className='text-center mt-2'>CT</div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={1} delay={1} />
//               </div>
//               <div className='text-center mt-2'>TAT</div>
//             </div>
//           </div>
//           <div className='justify-center flex items-center'>
//             <div>
//               <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
//                 <CountUp start={0} end={100} delay={1} />
//               </div>
//               <div className='text-center mt-2'>Wallet Amount</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='grid grid-cols-2 gap-4 my-8'>
//         {/* <div className='rounded-lg shadow px-4 py-4 bg-white'>
//           <AreaChart />
//         </div> */}
//         <div className='rounded-lg shadow px-4 py-4 bg-white'>
//           <Chart
//             chartType="PieChart"
//             data={pieChartData}
//             options={options}
//             width={"100%"}
//             height={"400px"}
//           />
//         </div>
//         <div className='rounded-lg shadow px-4 py-4 bg-white'>
//           <Chart
//             chartType="BarChart"
//             data={barChartData}
//             options={options}
//             width={"100%"}
//             height={"400px"}
//           />
//         </div>

//           </div>
//           <div className='grid grid-cols-3 gap-4 items-center bg-sky-100 rounded-xl shadow-lg mb-8 p-5'>
//           <div>
//             <h2 className='mb-5'>Monthly Complaints</h2>
//             <Chart
//               chartType="PieChart"
//               width="100%"
//               options={options}
//               height="400px"
//               data={prepareChartData('lastMonth')}
//             />
//             </div>
//             <div>
//               <h2 className='mb-5'>Weekly Complaints</h2>
//               <Chart
//                 chartType="PieChart"
//                 width="100%"
//                 height="400px"
//                 data={prepareChartData('lastWeek')}
//               />
//              </div>
//              <div >
//                 <h2 className='mb-5'>Daily Complaints</h2>
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="400px"
//                   data={prepareChartData('daily')}
//                 />
//               </div>
//             </div>
//           <div>
//             <RecentServicesList data={data} userData={userData} />
//           </div>
//         </>
//         );
// };

//         export default ServiceDashboard;
import React, { useEffect, useState } from 'react';
import http_request from '../../../http-request'; // Assuming this is your API utility
import CountUp from 'react-countup'; // For counting animations
import { Chart } from 'react-google-charts'; // For charts
import RecentServicesList from '../complaint/RecentServices'; // Assuming this component displays recent services

const ServiceDashboard = (props) => {
  const userData = props?.userData; // Technician's user data
  const dashData = props?.dashData; // Dashboard data for counts and summaries
  const [complaint, setComplaint] = useState([]); // State to hold complaint data
  const [refresh, setRefresh] = useState(""); // State for triggering data refresh
  const [averageTAT, setAverageTAT] = useState(0); // State for average TAT
  const [averageClosingTime, setAverageClosingTime] = useState(0); // State for average closing time (CT)
  const [averageResponseTime, setAverageResponseTime] = useState(0); // State for average response time (RT)
  const [tatPercentage, setTatPercentage] = useState(0); // State for TAT percentage
  const [ctPercentage, setCtPercentage] = useState(0); // State for CT percentage
  const [rtPercentage, setRtPercentage] = useState(0); // State for RT percentage

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
      const techComp = data.filter((item) => item?.assignServiceCenterId === userData._id);

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
        c.assignServiceCenterTime &&
        c.updatedAt &&
        !isNaN(new Date(c.assignServiceCenterTime)) &&
        !isNaN(new Date(c.updatedAt))
      );

      const ctData = completedComplaints.map(c => calculateCT(c.assignServiceCenterTime, c.updatedAt));
      const totalCT = ctData.reduce((sum, tat) => sum + tat, 0);
      const avgCT = ctData.length ? (totalCT / ctData.length).toFixed(2) : 0;
      const ct = avgCT <= 3 ? "100" : avgCT <= 6 ? "80" : avgCT <= 8 ? "60" : avgCT <= 12 ? "40" : avgCT <= 17 ? "30" : avgCT <= 24 ? "10" : "5"

      const rtData = completedComplaints.map(c => calculateCT(c.assignServiceCenterTime, c.srerviceCenterResponseTime));
      const totalRT = rtData.reduce((sum, tat) => sum + tat, 0);
      const avgRT = rtData.length ? (totalRT / rtData.length).toFixed(2) : 0;
      const rt = avgRT <= 3 ? "100" : avgRT <= 6 ? "80" : avgRT <= 8 ? "60" : avgRT <= 12 ? "40" : avgRT <= 17 ? "30" : avgRT <= 24 ? "10" : "5"
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

      setComplaint(data); // Store all fetched complaints
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

  return (
    <>
      {/* Render additional content or sections as needed */}

      {/* Display summary statistics */}
      <div className='my-8'>
        <div className='grid grid-cols-5 gap-4 items-center bg-sky-100 rounded-xl shadow-lg p-5'>
          {/* Example count display with CountUp */}
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.allComplaints} delay={1} />
              </div>
              <div className='text-center mt-2'>Total Service  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.complete} delay={1} />
              </div>
              <div className='text-center mt-2'>Completed  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.assign} delay={1} />
              </div>
              <div className='text-center mt-2'>Assigned  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.inProgress} delay={1} />
              </div>
              <div className='text-center mt-2'>In Progress </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
              </div>
              <div className='text-center mt-2'>Part Pending  </div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
              </div>
              <div className='text-center mt-2'>Pending  </div>
            </div>
          </div>
          {/* Continue with other statistics like assigned, pending, etc. */}
          {/* Include average TAT, CT, RT, and their percentages */}
          {/* Example for average closing time (CT) */}
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={averageClosingTime} delay={1} /> {"%"}
              </div>
              <div className='text-center mt-2'>CT</div>
            </div>
          </div>
          {/* Display CT percentage */}
          {/* <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={ctPercentage} delay={1} /> %
              </div>
              <div className='text-center mt-2'>CT</div>
            </div>
          </div> */}
          {/* Continue with other statistics like RT, TAT, etc. */}
          {/* Example for average response time (RT) */}
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={averageResponseTime} delay={1} /> {"%"}
              </div>
              <div className='text-center mt-2'>RT</div>
            </div>
          </div>
          {/* Display RT percentage */}
          {/* <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={rtPercentage} delay={1} /> %
              </div>
              <div className='text-center mt-2'>RT</div>
            </div>
          </div> */}
          {/* Continue with other statistics like TAT, etc. */}
          {/* Example for average TAT */}
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={averageTAT} delay={1} /> {"%"}
              </div>
              <div className='text-center mt-2'>TAT</div>
            </div>
          </div>
          {/* Display TAT percentage */}
          {/* <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={tatPercentage} delay={1} /> %
              </div>
              <div className='text-center mt-2'>TAT</div>
            </div>
          </div> */}
          {/* Continue with other statistics like CT, RT, etc. */}
          {/* Example for TAT percentage */}
          {/* <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={tatPercentage} delay={1} /> %
              </div>
              <div className='text-center mt-2'>TAT</div>
            </div>
          </div> */}
          {/* Continue with other statistics like RT, CT, etc. */}
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={100} delay={1} />
              </div>               <div className='text-center mt-2'>Wallet Amount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Display charts for visualization */}
      <div className='grid grid-cols-2 gap-4'>
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
      <div className='grid grid-cols-3 gap-4 items-center bg-sky-100 rounded-xl shadow-lg mb-8 p-5'>
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
      <div className='mt-8'>
        <RecentServicesList data={data} />
      </div>

      {/* Include other components or sections as required */}
    </>
  );
};

export default ServiceDashboard;
