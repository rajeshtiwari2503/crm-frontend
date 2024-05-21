import React from 'react'
import { Typography } from '@mui/material'
import { PeopleAlt } from '@mui/icons-material'

import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
const AdminDashboard = () => {
  return (
    <>
      <div className='grid md:grid-cols-4 sm:grid-cols-1 gap-4 mb-5'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-3 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='large' />
                <div className='ml-2'>
                  <div className='text-blue-600 font-semibold'>Users</div>
                  <div className='text-3xl font-semibold'>
                    <CountUp start={0} end={100} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-3 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='large' />
                <div className='ml-2'>
                  <div className='text-blue-600 font-semibold'>Brands</div>
                  <div className='text-3xl font-semibold'>
                    <CountUp start={0} end={100} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-3 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='large' />
                <div className='ml-2'>
                  <div className='text-blue-600 font-semibold'>Employees</div>
                  <div className='text-3xl font-semibold'>
                    <CountUp start={0} end={100} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-3 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='large' />
                <div className='ml-2'>
                  <div className='text-blue-600 font-semibold'>Service Centers</div>
                  <div className='text-3xl font-semibold'>
                    <CountUp start={0} end={100} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-10 rounded-md flex items-center pl-5 bg-sky-200 text-1xl font-bold mb-3'>Complaints</div>
      <div className='grid md:grid-cols-4 sm:grid-cols-1 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total users</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4 gap-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>New</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              {/* <div className='ml-5 mt-3'>
              <PeopleAlt fontSize='large' />
            </div> */}
              {/* <div className='mr-7 mt-3 roundProgress'>
              <h2>Progress</h2>
              <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
            </div> */}
            </div>
            <div className='pl-5 py-3 flex justify-between items-center'>
              <div className='flex items-center'>
                <PeopleAlt fontSize='large' />
                <div className='ml-2'>
                  <div className='text-blue-600 font-semibold'>In Progress</div>
                  <div className='text-3xl font-semibold'>
                    <CountUp start={0} end={100} delay={1} />
                  </div>
                </div>
              </div>
              <div className='mr-7   roundProgress'>
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
          </div>

        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Completed</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Close</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Un Paid </div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Rejected</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Cancelled</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Complaints</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Pending</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Calls</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Dealer Calls</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Service Center Visit</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-10 rounded-md flex items-center pl-5 bg-sky-200 text-1xl font-bold mt-5 mb-3'>Pending Complaints</div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>24 Hours</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>3 Days</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>1 Week</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Week +</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-10 rounded-md flex items-center pl-5 bg-sky-200 text-1xl font-bold mt-5 mb-3'>Parts Request</div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>New</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Approved</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Dispatch</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Parts</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-10 rounded-md flex items-center pl-5 bg-sky-200 text-1xl font-bold mt-5 mb-3'>Pending Invoice</div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Total Invoice</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>New</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Approved</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between'>
              <div className='ml-5 mt-3'>
                <PeopleAlt fontSize='large' />
              </div>
              <div className='mr-7 mt-3 roundProgress'>
                {/* <h2>Progress</h2> */}
                <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
              </div>
            </div>
            <div className='pl-5 py-3'>
              <div className='text-blue-600 font-semibold'>Paid</div>
              <div className='text-3xl font-semibold'>
                <CountUp start={0} end={100} delay={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4 my-8'>
        <div className='col-span-5 rounded-lg shadow px-4 py-4 bg-white'>
          <AreaChart />
        </div>
        <div className='col-span-7 rounded-lg shadow px-4 py-4 bg-white'>
          <PieChart />

        </div>
      </div>
    </>

  )
}

export default AdminDashboard