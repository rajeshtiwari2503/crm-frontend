
"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
// import PieChart from './charts/pieChart'
// import AreaChart from './charts/areaChart'
import dynamic from 'next/dynamic'

const AreaChart=dynamic(()=>import("./charts/areaChart"),{
    loading: ()=><p>Chart loading.........</p>
});
const PieChart=dynamic(()=>import("./charts/pieChart"),{
    loading: ()=><p>Chart loading.........</p>
});
const Analytics = () => {
    return (
        <>
            <Sidenav>
                <>
                    <h2 className='text-lg mb-2 '>Analytics</h2>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className='col-span-5 rounded-lg shadow px-4 py-4 bg-white'>
                        <AreaChart />
                        </div>
                        <div className='col-span-7 rounded-lg shadow px-4 py-4 bg-white'>
                        <PieChart />

                        </div>
                    </div>
                   
                </>
            </Sidenav>
        </>
    )
}

export default Analytics