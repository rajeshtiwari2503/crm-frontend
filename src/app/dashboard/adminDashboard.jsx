import React, { useState } from 'react'
import { Typography } from '@mui/material'
import { Assignment, AssignmentTurnedIn, Cancel, CurrencyRupee, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, Settings, ShoppingBag } from '@mui/icons-material'

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
import PartPendingTodayUpadteComplaintList from '../complaint/PartPendingTodayUpdated';
import PartPendingTodayNotUpadteComplaintList from '../complaint/PartPendingTodayNotUpdated';
import { ReactLoader } from '../components/common/Loading';

const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
const AdminDashboard = (props) => {

  const data = props?.dashData;
  // console.log(data);
  const router = useRouter();


  const [complaints, setComplaints] = useState([])
  const [brandData, setBrandData] = useState([]);
  const [loading, setloading] = React.useState(false);
  const [serviceLoading, setServiceLoading] = React.useState(false);

  const [serviceDetails, setServiceDetails] = useState("");

  React.useEffect(() => {
    // getAllComplaint()
    getOrderPriceAndDepositsByServiceCenter()
    fetchComplaintData();
  }, []);

  const getOrderPriceAndDepositsByServiceCenter = async () => {
    try {

setServiceLoading(true)
      const response = await http_request.get(`/getAllServiceCenterOrdersAndDeposits`);

      let { data } = response;
      // console.log("data",data);

      setServiceDetails(data);
      setServiceLoading(false)
    } catch (err) {
        setServiceLoading(false)
      console.error("Error fetching transactions:", err);
    } finally {
      // setLoading(false);
        setServiceLoading(false)
    }
  };
  // console.log("serviceDetails", serviceDetails);


  const pieChartData = [
    ["Task", "Hours per Day"],
    // ["AllComplaints", data?.complaints?.allComplaints],
    ["Assign", data?.complaints?.assign],
    ["Pending", data?.complaints?.pending],
    ["Complete", data?.complaints?.complete],
    ["PartPending", data?.complaints?.partPending],
    ["customerSidePending", data?.complaints?.customerSidePending],
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
    ["customerSidePending", data?.complaints?.customerSidePending],
    ["FinalVerification", data?.complaints?.finalVerification],
    ["Cancel", data?.complaints?.cancel],
    ["In Progress", data?.complaints?.inProgress],

  ];

  const options = {
    title: `Complaints Summary All Complaints ${data?.complaints?.allComplaints}`,
    pieHole: 0.4, // Makes it a donut chart (optional)
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "value",
    legend: { position: "right" },
  };



  const fetchComplaintData = async () => {
    try {
      setloading(true)
      const response = await http_request.get("/getComplaintCountByBrand");
      setBrandData(response.data.data);
      setloading(false)
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setloading(false)
    }
  };

  // const getAllComplaint = async () => {
  //   try {
  //     let response = await http_request.get("/getAllComplaint");
  //     let { data } = response;
  //     setComplaints(data?.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


  return (
    <>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mb-3'>Users</div>

      <div className='grid md:grid-cols-5 sm:grid-cols-1  gap-4 mb-5'>

        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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

      <div className='grid md:grid-cols-5 sm:grid-cols-1  gap-4 mb-5'>


        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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
        <div className=''>
          <div onClick={() => router.push("/complaint/customerSidePending")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Customer Side Pending</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.customerSidePending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div onClick={() => router.push("/complaint/allComplaint")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Total Pending</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.partPending + data?.complaints?.inProgress + data?.complaints?.pending + data?.complaints?.assign + data?.complaints?.customerSidePending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div onClick={() => router.push("/complaint/scheduleUpcomming")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>  Upcomming Schedule</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.schedule} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
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
        <div className=''>
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
        <div className=''>
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



        <div className=''>
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
        <div className=''>
          <div onClick={() => router.push(`/complaint/todayCloseComplaint`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <AssignmentTurnedIn fontSize='medium' />
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
        <div className=''>
          <div onClick={() => router.push(`/complaint/todayCreateComplaint`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Assignment fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Today created</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.createdToday} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=' h-8 col-span-4 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Pending Complaints</div>

      <div className='grid md:grid-cols-5 sm:grid-cols-1  gap-4'>
        <div className=''>
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
        <div className=''>
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
        <div className=''>
          <div onClick={() => router.push(`/complaint/pending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>more than 5 days</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.moreThanFiveDays} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div onClick={() => router.push(`/complaint/pending/${"schedule"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >

            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center justify-between'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>Schedule   Today</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.scheduleUpcomming} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className=' h-8 col-span-4 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Day wise Part Pending Complaints</div>

      <div className='grid md:grid-cols-5 sm:grid-cols-1  gap-4'>
        <div className=''>
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
        <div className=''>
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
        <div className=''>
          <div onClick={() => router.push(`/complaint/partpending/${"more-than-week"}`)} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <Settings fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>more than 5 days</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.moreThanFiveDaysPartPending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className=' h-8 rounded-md flex items-center pl-5 bg-white shadow-lg   transi duration-150 text-1xl text-[#09090b] font-bold mt-5 mb-3'>Other Details </div>
     
     <> {serviceLoading===true ?  <div className="flex justify-center items-center   ">
                <ReactLoader />
            </div>
    : <div className='grid md:grid-cols-5 sm:grid-cols-1 gap-4'>
          <div className=''>
            <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
              <div className='flex justify-between'>
              </div>
              <div className='pl-5 py-1 flex justify-between items-center'>
                <div className='flex items-center'>
                  <CurrencyRupee fontSize='medium' />
                  <div className='ml-2'>
                    <div className='text-blue-500 font-semibold'> Deposite Amount </div>
                    <div className=' text-2xl font-semibold'>
                      <CountUp start={0} end={serviceDetails?.totalDepositAll} delay={1} />
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
                      <CountUp start={0} end={serviceDetails?.totalOrderPriceAll} delay={1} />
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
                      <CountUp start={0} end={serviceDetails?.approvedOrderCountAll} delay={1} />
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
                      <CountUp start={0} end={serviceDetails?.notApprovedOrderCountAll} delay={1} />
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
                      <CountUp start={0} end={serviceDetails?.canceledOrderCountAll} delay={1} />
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
                      <CountUp start={0} end={serviceDetails?.orderCountAll} delay={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      }
      </>

      <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-4 my-8'>
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
          {loading === true ? (
            <div className="flex items-center justify-center h-[80vh]">
              <ReactLoader />
            </div>
          ) : (
            <Chart
              chartType="PieChart"
              data={pieChartBrandPenData}
              options={optionsPenBrand}
              width={"100%"}
              height={"100%"}
            />
          )}
        </div>
        <div className='rounded-lg shadow  bg-white'>
          {loading === true ? (
            <div className="flex items-center justify-center h-[80vh]">
              <ReactLoader />
            </div>
          ) : (
            <Chart
              chartType="PieChart"
              data={pieChartBrandData}
              options={optionsBrand}
              width={"100%"}
              height={"100%"}
            />
          )}
        </div>

        <div className='  md:w-full w-[260px]   '>
          {loading === true ? (
            <div className="flex items-center justify-center h-[80vh]">
              <ReactLoader />
            </div>
          ) : (
            <BrandWiseComplaintList brandData={brandData} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className=' md:w-full w-[260px]  '>
          <ServiceCenterWiseComplaintList />
        </div>

        <div className='md:w-full w-[260px]'>
          <CityWiseComplaintList />
        </div>
      </div>

      <div className='md:w-full w-[260px]'>
        <HighPriorityComplaintList data={complaints} />
      </div>
      <div className='   md:w-full w-[260px] '>
        <UnAssignComplaintList />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className=' md:w-full w-[260px]  '>
          <PartPendingTodayUpadteComplaintList />
        </div>

        <div className='md:w-full w-[260px]'>
          <PartPendingTodayNotUpadteComplaintList />
        </div>
      </div>

      <div className='md:w-full w-[260px]'>
        <RecentServicesList data={complaints} userData={props?.userData} />
        <div>
          {/* <UploadApk /> */}
        </div>
      </div>
    </>

  )
}

export default AdminDashboard