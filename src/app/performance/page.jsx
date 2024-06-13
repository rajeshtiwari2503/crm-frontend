"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
import dynamic from 'next/dynamic';


const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
    loading: () => <p>Chart loading.........</p>
  });
  const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
    loading: () => <p>Chart loading.........</p>
  });
const Performance = () => {
  return (
    <Sidenav>
    <div className='grid grid-cols-12 gap-4 my-8'>
        <div className='col-span-5 rounded-lg shadow px-4 py-4 bg-white'>
          <AreaChart />
        </div>
        <div className='col-span-7 rounded-lg shadow px-4 py-4 bg-white'>
          <PieChart />
        </div>
        
      </div>
    </Sidenav>
  )
}

export default Performance