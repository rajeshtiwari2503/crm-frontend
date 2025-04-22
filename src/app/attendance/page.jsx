"use client"
import React, { useEffect } from 'react'
import Sidenav from '../components/Sidenav'
import Clock from './attendance'
import Tasks from './task'
import AdminAttendanceList from './adminAttendanceList'
import { useUser } from '../components/UserContext'
import UserAttendanceList from './userAttendanceList'

const Attendance = () => {
    const { user } = useUser()


    return (
        <Sidenav>
            {user?.user?.role === "ADMINq" ?
             <div className="grid grid-cols-1   gap-4">
                <AdminAttendanceList />
                </div>
                :
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Clock />
                        </div>
                        <div>
                            <Tasks />
                        </div>
                    <div className="md:col-span-2">
                        <UserAttendanceList userId={user?.user?._id} />
                    </div>

                </div>
        </>
              
            }
        </Sidenav >

    )
}

export default Attendance