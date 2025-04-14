import React from 'react'
import { Typography } from '@mui/material'
import { Assignment, AssignmentTurnedIn, Cancel, FactCheck, LocalShipping, PausePresentation, Pending, PendingActions, PeopleAlt, Settings, ShoppingBag } from '@mui/icons-material'

import { Circle } from 'rc-progress'
import CountUp from 'react-countup';
import dynamic from 'next/dynamic'
import HighPriorityComplaintList from '../complaint/HighPriorityComplaints';
import { useRouter } from 'next/navigation';


const EmployeeDashboard = (props) => {
  const router = useRouter()
  const data = props?.dashData;
  return (
    <>
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
                    <CountUp start={0} end={data?.complaints?.partPending + data?.complaints?.inProgress + data?.complaints?.pending + data?.complaints?.assign + data?.complaints?.customerSidePending} delay={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 sm:col-span-4 xs:col-span-4'>
          <div onClick={() => router.push("/complaint/scheduleUpcomming")} className='mx-auto bg-sky-50 rounded-xl shadow-lg hover:scale-105 transi duration-150 cursor-pointer' >
            <div className='flex justify-between'>
            </div>
            <div className='pl-5 py-1 flex justify-between items-center'>
              <div className='flex items-center'>
                <PendingActions fontSize='medium' />
                <div className='ml-2'>
                  <div className='text-blue-500 font-semibold'>  Upcomming</div>
                  <div className=' text-2xl font-semibold'>
                    <CountUp start={0} end={data?.complaints?.schedule } delay={1} />
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
                  <div className='text-blue-500 font-semibold'>Schedule   Today</div>
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
      <div className='mt-10  justify-center'>
        <HighPriorityComplaintList />
      </div>
    </>
  )
}

export default EmployeeDashboard