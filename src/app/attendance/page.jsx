"use client"
import React, { useEffect } from 'react'
import Sidenav from '../components/Sidenav'
import Clock from './attendance'
import Tasks from './task'
import AdminAttendanceList from './adminAttendanceList'
import { useUser } from '../components/UserContext'

const Attendance = () => {
    const { user } = useUser()


    return (
        <Sidenav>
            {user?.user?.role === "ADMIN" ?
                <AdminAttendanceList />
                :
                <>
                    <Clock />
                    <Tasks />
                </>
            }
        </Sidenav>

    )
}

export default Attendance