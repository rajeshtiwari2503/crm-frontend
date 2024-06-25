import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { Balance, Inventory, PeopleAlt } from '@mui/icons-material'
import http_request from "../../../http-request"
import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'
import AssignComplaintList from '../complaint/asign/assignComplaintList';
import { Chart } from "react-google-charts";


const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
const DealerDashboard = (props) => {
  const userData = props?.userData
  const dashData = props?.dashData
  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllComplaint()

  }, [refresh])

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const filterData = userData?.role === "ADMIN" ? complaint
    : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
        : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
          : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
            : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
              : complaint

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }
   const chartData = [
    ["Task", "Hours per Day"],
    ["AllComplaints", dashData?.complaints?.allComplaints],
    ["Assign", dashData?.complaints?.assign],
    ["Pending", dashData?.complaints?.pending],
    ["Complete", dashData?.complaints?.complete],
    ["PartPending", dashData?.complaints?.partPending],
  ];
  
   const options = {
    title: "Complaints Summary",
  };

  return (
    <>
      <div className='grid grid-cols-2 gap-4'>

      </div>

      <div className='  my-8'>
        <div className='grid grid-cols-4 gap-4 items-center bg-sky-100 rounded-xl shadow-lg  p-5'>
          <div className=' justify-center flex items-center  '>
            <div>
              <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.allComplaints} delay={1} />
              </div>
              <div className='text-center mt-2'>total service requests</div>
            </div>
          </div>
          <div className='justify-center flex items-center  '>
            <div>
              <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.complete} delay={1} />
              </div>
              <div className='text-center mt-2'>completed requests</div>
            </div>
          </div>
          <div className='justify-center flex items-center  '>
            <div>
              <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.assign} delay={1} />
              </div>
              <div className='text-center mt-2'>Assign requests</div>
            </div>
          </div>
          <div className='justify-center flex items-center  '>
            <div>
              <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={dashData?.complaints?.pending} delay={1} />
              </div>
              <div className='text-center mt-2'>pending requests</div>
            </div>
          </div>
          <div className='justify-center flex items-center  '>
            <div>
              <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                <CountUp start={0} end={100} delay={1} />
              </div>
              <div className='text-center mt-2'>Wallet Ammount</div>
            </div>
          </div>

        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 my-8'>
        <div className='  rounded-lg shadow px-4 py-4 bg-white'>
          <AreaChart />
        </div>
        <div className='  rounded-lg shadow px-4 py-4 bg-white'>
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>

      </div>
      <div>
        <AssignComplaintList data={data} dashboard={true} />
      </div>
    </>
  )
}

export default DealerDashboard