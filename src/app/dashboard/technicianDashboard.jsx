import React, { useEffect, useState } from 'react';
 
import http_request from '../../../http-request';
 
import CountUp from 'react-countup';
 
 
import { Chart } from 'react-google-charts';
import RecentServicesList from '../complaint/RecentServices';

 

const TechnicianDashboard = (props) => {
  const userData = props?.userData;
  const dashData = props?.dashData;
  const [complaint, setComplaint] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [averageTAT, setAverageTAT] = useState(0);
  const [averageClosingTime, setAverageClosingTime] = useState(0);

  useEffect(() => {
    getAllComplaint();
  }, [refresh]);


  const calculateTAT = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const TAT = (updated - created) / (1000 * 60 * 60); // Convert milliseconds to hours
    return TAT;
  };

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDifference = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    return timeDifference;
  };

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint");
      let { data } = response;
     
      const completedComplaints1 = data.filter(c => c.status === 'COMPLETED');
      const tatData = completedComplaints1.map(c => calculateTAT(c.createdAt, c.updatedAt));
      const totalTAT = tatData.reduce((sum, tat) => sum + tat, 0);
      const avgTAT = tatData.length ? (totalTAT / tatData.length).toFixed(2) : 0;

      setAverageTAT(avgTAT);
      const completedComplaints = data.filter(c => c.status === 'COMPLETED' && c.assignTechnicianTime && c.updatedAt);
      const closingTimes = completedComplaints.map(c => calculateTimeDifference(c.assignTechnicianTime, c.updatedAt));
      
      if (closingTimes.length > 0) {
        const totalClosingTime = closingTimes.reduce((sum, time) => sum + time, 0);
        const avgClosingTime = (totalClosingTime / closingTimes.length).toFixed(2);
        console.log('Average Closing Time:', avgClosingTime);
        setAverageClosingTime(avgClosingTime);
      } else {
        console.log('No completed complaints with valid assignTechnicianTime and updatedAt found.');
      }

     
      setComplaint(data);
    } catch (err) {
      console.log(err);
    }
  };

  
console.log(averageTAT);
console.log(averageClosingTime);


  const filterData = userData?.role === "ADMIN" ? complaint
    : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
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
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
    ["InProgress", dashData?.complaints?.inProgress],
  ];

  const barChartData = [
    ["Complaint Status", "Count"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
    ["InProgress", dashData?.complaints?.inProgress],

  ];
  const options = {
    title: "Complaints Summary",
  };

  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        {/* Additional Content */}
      </div>

      <div className='my-8'>
        <div className='grid grid-cols-5 gap-4 items-center bg-sky-100 rounded-xl shadow-lg p-5'>
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
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={1} delay={1} />
              </div>
              <div className='text-center mt-2'>RT</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={1} delay={1} />
              </div>
              <div className='text-center mt-2'>CT</div>
            </div>
          </div>
          <div className=' flex justify-center items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={averageTAT} delay={1} /> {"Hours"}
              </div>
              <div className='text-center mt-2'>TAT</div>
            </div>
          </div>
          <div className='justify-center flex items-center'>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={100} delay={1} />
              </div>
              <div className='text-center mt-2'>Wallet Amount</div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 my-8'>
        {/* <div className='rounded-lg shadow px-4 py-4 bg-white'>
          <AreaChart />
        </div> */}
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
      <RecentServicesList data={data} userData={userData} />
      </div>
    </>
  );
};

export default TechnicianDashboard;
