"use client"
import React, { useEffect, useState } from 'react'
import Dashboard from '@/app/dashboard/page';
import SignIn from '@/app/sign_in/page';



const HomePageCRM = () => {

    const [value, setValue] = useState("");

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
        }
    }, []);
    return (
        <main className="   ">

            {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "SERVICE" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "USER"
                ? <Dashboard />
                : <SignIn />
            }
        </main>
    )
}
export default HomePageCRM