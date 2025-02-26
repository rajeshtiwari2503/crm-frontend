import React, { useState } from 'react'
import { Typography } from '@mui/material'
import { Assignment, AssignmentTurnedIn, Cancel, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, Settings, ShoppingBag } from '@mui/icons-material'

import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'
import Chart from 'react-google-charts';
import http_request from "../../../http-request"
import RecentServicesList from '../complaint/RecentServices';
import { useRouter } from 'next/navigation';
import UploadApk from '../components/AppAPK';
import HighPriorityComplaintList from '../complaint/HighPriorityComplaints';
import UnAssignComplaintList from '../complaint/UnAssignComplaints';
import CityWiseComplaintList from '../complaint/CityWiseComplaints';
import ServiceCenterWiseComplaintList from '../complaint/ServiceCenterWiseComplaint';
import BrandWiseComplaintList from '../complaint/BrandWiseComplaint';

const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
const AdminDashboard = (props) => {

  const data = props?.dashData;
  console.log(data);
  const router = useRouter();


  const [orderData, setOrderData] = useState([])
  const [complaints, setComplaints] = useState([])
  const [brandData, setBrandData] = useState([]);

  React.useEffect(() => {
    getAllComplaint()
    getAllOrder()
    fetchComplaintData();
  }, []);

  const pieChartData = [
    ["Task", "Hours per Day"],
    ["AllComplaints", data?.complaints?.allComplaints],
    ["Assign", data?.complaints?.assign],
    ["Pending", data?.complaints?.pending],
    ["Complete", data?.complaints?.complete],
    ["PartPending", data?.complaints?.partPending],
    ["FinalVerification", data?.complaints?.finalVerification],
    ["Cancel", data?.complaints?.cancel],
    ["In Progress", data?.complaints?.inProgress],
  ];
  const pieChartBrandData = [
    ["Brand", "Total"], // Header for PieChart
    ...brandData?.map((item) => [item.productBrand, item.TOTAL]),
  ];
  const pieChartBrandPenData = [
    ["Brand", "Total"], // Header for PieChart
    ...brandData?.map((item) => [item.productBrand, item.PENDING]),
  ];
  const optionsPenBrand = {
    title: "Pendind Complaints by Brand ",
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0. } },
    pieSliceText: "value",
    // pieSliceText: "label",
    legend: { position: "right" },
  };
  const optionsBrand = {
    title: "Complaints by Brand",
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "value",
    legend: { position: "right" },
  };
  const barChartData = [
    ["Complaint Status", "Count"],
    ["AllComplaints", data?.complaints?.allComplaints],
    ["Assign", data?.complaints?.assign],
    ["Pending", data?.complaints?.pending],
    ["Complete", data?.complaints?.complete],
    ["PartPending", data?.complaints?.partPending],
    ["FinalVerification", data?.complaints?.finalVerification],
    ["Cancel", data?.complaints?.cancel],
    ["In Progress", data?.complaints?.inProgress],

  ];

  const options = {
    title: "Complaints Summary",
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "value",
    legend: { position: "right" },
  };

  

  const fetchComplaintData = async () => {
    try {
      const response = await http_request.get("/getComplaintCountByBrand");
      setBrandData(response.data.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint");
      let { data } = response;
      setComplaints(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllOrder = async () => {

    try {

      const endPoint = "/getAllOrder"

      let response = await http_request.get(endPoint)
      let { data } = response;

      setOrderData(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  // console.log(orderData?.length);
  const order = orderData?.filter((f) => f?.status === "ORDER")
  // console.log(order);
  const approveOrder = order?.filter((f) => f?.brandApproval === "APPROVED")
  // console.log(approveOrder);
  const notApproveOrder = order?.filter((f) => f?.brandApproval === "NOT_APPROVE")
  // console.log(notApproveOrder);
  const cancelOrder = orderData?.filter((f) => f?.status === "OrderCanceled")
  // console.log(cancelOrder);
  return (
    <>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Users</div>

      <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4 mb-5'>

        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/user/customer")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold '>Customers</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.customers} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/user/brand")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Brands</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.brands} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/user/dealer")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Dealer</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.dealers} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/user/service")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Service Centers</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.services} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/user/technician")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Technician</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.technicians} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Independent Service  Payment</div>

<div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4 mb-5'>

  
  <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
    <div onClick={() => router.push("/wallet/servicetransactions")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
      <div className='flex justify-between'>
      </div>
      <div className='pl-5 py-1 flex justify-between items-center'>
        <div className='flex items-center'>
          <PeopleAlt fontSize='medium' />
          <div className='ml-2'>
            <div className='text-blue-500 font-semibold'>Paid Payment</div>
            <div className=' text-2xl font-semibold'>
              <CountUp start={0} end={data?.centerPaidPayment} delay={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
    <div onClick={() => router.push("/wallet/servicetransactions")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
      <div className='flex justify-between'>
      </div>
      <div className='pl-5 py-1 flex justify-between items-center'>
        <div className='flex items-center'>
          <PeopleAlt fontSize='medium' />
          <div className='ml-2'>
            <div className='text-blue-500 font-semibold'>UnPaid Payment</div>
            <div className=' text-2xl font-semibold'>
              <CountUp start={0} end={data?.centerUnPaidPayment} delay={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
    <div onClick={() => router.push("/wallet/servicetransactions")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
      <div className='flex justify-between'>
      </div>
      <div className='pl-5 py-1 flex justify-between items-center'>
        <div className='flex items-center'>
          <PeopleAlt fontSize='medium' />
          <div className='ml-2'>
            <div className='text-blue-500 font-semibold '>Total Payments</div>
            <div className=' text-2xl font-semibold'>
              <CountUp start={0} end={data?.centerPayment} delay={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Complaints</div>

      <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/pending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Pending</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.pending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/inprogress")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Pending fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>In Progress</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.inProgress} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/assign")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <AssignmentTurnedIn fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Assign</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.assign} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/partpending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Part Pending</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.partPending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Total Pending</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.partPending + data?.complaints?.inProgress + data?.complaints?.pending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/cancel")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Cancel fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Cancel</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.cancel} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/finalVerification")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <FactCheck fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Final Verification</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.finalVerification} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/close")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <AssignmentTurnedIn fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Close</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.complete} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Assignment fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Total Complaints</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.allComplaints} delay={1} />
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
          <div onClick={() => router.push(`/complaint/pending/${"0-1"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center justify-between'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>0-1 day</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.zeroToOneDays} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/pending/${"2-5"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>2-5 Days</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.twoToFiveDays} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/pending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>more than week</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.moreThanFiveDays} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/pending/${"schedule"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center justify-between'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Schedule Align Today</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.scheduleUpcomming} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/close`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Today completed</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.completedToday} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' h-8 col-span-4 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Part Pending Complaints</div>

      <div className='grid grid-cols-5 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/partpending/${"0-1"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>0-1 day</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.zeroToOneDaysPartPending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/partpending/${"2-5"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>2-5 Days</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.twoToFiveDaysPartPending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push(`/complaint/partpending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>more than week</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.moreThanFiveDaysPartPending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Order </div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <ShoppingBag fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>New Order</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={order?.length} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <ShoppingBag fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Cancel Order</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={cancelOrder?.length} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <ShoppingBag fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Approved</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={approveOrder?.length} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <ShoppingBag fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Not Approved</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={notApproveOrder?.length} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/inventory/order")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <ShoppingBag fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Total Orders</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={orderData?.length} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='grid grid-cols-2 gap-4 my-8'>
        <div className='rounded-lg shadow   bg-white'>
          <Chart
            chartType="PieChart"
            data={pieChartData}
            options={options}
            width={"100%"}
            height={"100%"}
          />
        </div>
        <div className='rounded-lg shadow  bg-white'>
          <Chart
            chartType="PieChart"
            data={pieChartBrandPenData}
            options={optionsPenBrand}
            width={"100%"}
            height={"100%"}
          />
        </div>
        <div className='rounded-lg shadow  bg-white'>
          <Chart
            chartType="PieChart"
            data={pieChartBrandData}
            options={optionsBrand}
            width={"100%"}
            height={"100%"}
          />
        </div>
        {/* <div className='rounded-lg shadow px-4 py-4 bg-white'>
          <Chart
            chartType="BarChart"
            data={barChartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div> */}
        <div>
          <BrandWiseComplaintList brandData={brandData}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div>
          <ServiceCenterWiseComplaintList />
        </div>
     
      <div>
        <CityWiseComplaintList />
      </div>
      </div>
      <div>
        <HighPriorityComplaintList data={complaints} />
      </div>
      <div>
        <UnAssignComplaintList />
      </div>
     

      <div>
        <RecentServicesList data={complaints} />
        <div>
          {/* <UploadApk /> */}
        </div>
      </div>
    </>

  )
}

export default AdminDashboard