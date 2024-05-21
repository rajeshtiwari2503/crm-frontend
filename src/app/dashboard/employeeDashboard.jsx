import React from 'react'
import { Typography } from '@mui/material'
import { PeopleAlt } from '@mui/icons-material'

import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'

const AreaChart=dynamic(()=>import("../analytics/charts/areaChart"),{
    loading: ()=><p>Chart loading.........</p>
  });
  const PieChart=dynamic(()=>import("../analytics/charts/pieChart"),{
    loading: ()=><p>Chart loading.........</p>
  });
const  EmployeeDashboard = () => {
  return (
    <>
    <div className='grid grid-cols-4 gap-4'>
      <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
        <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
          <div className='flex justify-between'>
            <div className='ml-5 mt-5'>
              <PeopleAlt fontSize='large' />
            </div>
            <div className='mr-7 mt-5 roundProgress'>
              {/* <h2>Progress</h2> */}
              <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
            </div>
          </div>
          <div className='pl-5 py-5'>
            <div className='text-blue-600 font-semibold'>Total users</div>
            <div className='text-3xl font-semibold'>
              <CountUp start={0} end={100} delay={1} />
            </div>
          </div>
        </div>
      </div>
      <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
        <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
          <div className='flex justify-between'>
            <div className='ml-5 mt-5'>
              <PeopleAlt fontSize='large' />
            </div>
            <div className='mr-7 mt-5 roundProgress'>
              {/* <h2>Progress</h2> */}
              <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
            </div>
          </div>
          <div className='pl-5 py-5'>
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
            <div className='ml-5 mt-5'>
              <PeopleAlt fontSize='large' />
            </div>
            <div className='mr-7 mt-5 roundProgress'>
              {/* <h2>Progress</h2> */}
              <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
            </div>
          </div>
          <div className='pl-5 py-5'>
            <div className='text-blue-600 font-semibold'>In Progress</div>
            <div className='text-3xl font-semibold'>
              <CountUp start={0} end={100} delay={1} />
            </div>
          </div>
        </div>
      </div>
      <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
        <div className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
          <div className='flex justify-between'>
            <div className='ml-5 mt-5'>
              <PeopleAlt fontSize='large' />
            </div>
            <div className='mr-7 mt-5 roundProgress'>
              {/* <h2>Progress</h2> */}
              <Circle percent={70} strokeWidth={10} trailWidth={8} strokeColor="rgb(2, 132, 190)" />
            </div>
          </div>
          <div className='pl-5 py-5'>
            <div className='text-blue-600 font-semibold'>Part Request</div>
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

export default  EmployeeDashboard