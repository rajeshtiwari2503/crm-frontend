"use client"
import React, { useEffect, useState } from 'react'
import Dashboard from '@/app/dashboard/page';
import SignIn from '@/app/sign_in/page';
import { useUser } from '../UserContext';



const HomePageCRM = () => {
  const { user } = useUser();
   
    return (
        <main className="   ">

            {user?.user?.role === "ADMIN" || user?.user?.role === "BRAND" || user?.user?.role === "SERVICE" || user?.user?.role === "DEALER" || user?.user?.role === "USER"|| user?.user?.role === "TECHNICIAN"
                ? <Dashboard />
                : <SignIn />
            }
        </main>
    )
}
export default HomePageCRM