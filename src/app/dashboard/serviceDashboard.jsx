import React from 'react'
import { Typography } from '@mui/material'
import { Balance, Inventory, PeopleAlt } from '@mui/icons-material'

import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
const ServiceDashboard = () => {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4 cursor-pointer'>
          <div className='mx-auto bg-sky-200 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between items-center p-5'>
            <div className='  '>
                <Balance fontSize='large' />
                <div className='text-blue-600  '>Wallet <br/>Transaction </div>
              </div>
            <div className='grid grid-cols-4 gap-4 items-center bg-sky-100 rounded-xl shadow-lg  p-5'>
                <div className=' justify-center flex items-center  '>
                  <div>
                    <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Balance</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Pendind</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Pay</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Total</div>
                  </div>
                </div>
                
              </div>
             
              {/* <div>
                <div className='text-md   '>
                  <div>
                    Total Pay : <CountUp start={0} end={100} delay={1} />
                  </div>
                  <div>
                    Wallet Balance : <CountUp start={0} end={50} delay={1} />
                  </div>
                  <div>
                    Use Balance : <CountUp start={0} end={50} delay={1} />
                  </div>
                  <div>
                    Pending : <CountUp start={0} end={50} delay={1} />
                  </div>
                </div>
              </div> */}
            </div>

          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4 cursor-pointer'>
          <div className='mx-auto bg-pink-200 rounded-xl shadow-lg hover:scale-105 transi duration-150'>
            <div className='flex justify-between items-center p-5'>
              <div className='  '>
                <Inventory fontSize='large' />
                <div className='text-blue-600  '>Spareparts  </div>
              </div>
              <div>
                <div className='text-md   '>
                  <div>
                    Total Spareparts : <CountUp start={0} end={100} delay={1} />
                  </div>
                  <div>
                    brand Spareparts : <CountUp start={0} end={50} delay={1} />
                  </div>
                  <div>
                    Use Spareparts: <CountUp start={0} end={50} delay={1} />
                  </div>
                  <div>
                    Pending : <CountUp start={0} end={50} delay={1} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    
      <div className='  my-8'>
        <div className='font-bold mb-3'> My Complaints</div>
       
              <div className='grid grid-cols-4 gap-4 items-center bg-sky-100 rounded-xl shadow-lg  p-5'>
                <div className=' justify-center flex items-center  '>
                  <div>
                    <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>New</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-red-400 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Pendind</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-green-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Close</div>
                  </div>
                </div>
                <div className='justify-center flex items-center  '>
                  <div>
                    <div className='bg-gray-300 rounded-md mt-3 cursor-pointer p-4'>
                      <CountUp start={0} end={100} delay={1} />
                    </div>
                    <div className='text-center mt-2'>Total</div>
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

export default ServiceDashboard