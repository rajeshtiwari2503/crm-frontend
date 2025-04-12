//  "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import http_request from "../../../http-request";
// import { useRouter } from "next/navigation";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {

//     const router=useRouter()
//     const [user, setUser] = useState(null);
//     const [isReloaded, setIsReloaded] = useState(false);

//     useEffect(() => {
//         // Detect window reload
//         const navigationEntries = window.performance.getEntriesByType("navigation");
//         const isReload = navigationEntries.length > 0 && navigationEntries[0].type === "reload";
// // console.log("isReload",isReload);

//         if (isReload) {
//             setIsReloaded(true); // Set state if the page was reloaded
//         }

//         // Always check localStorage for user data
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             try {
//                 const userId = JSON.parse(storedUser)?.user?._id;
//                 if (userId) {
//                     getProfileById(userId);
//                 }
//             } catch (error) {
//                 console.error("Error parsing user data from localStorage", error);
//                 router.push("/sign_in"); // Redirect to login if error occurs
//             }
//         } else {
//             router.push("/sign_in"); // Redirect if no user data found
//         }
//     }, [isReloaded]); // Runs once when component mounts

//     const getProfileById = async (id) => {
//         try {
//             const response = await http_request.get(`/getUserServerById/${id}`);
//             setUser(response.data);
//         } catch (err) {
//             console.error("Error fetching user profile", err);
//         }
//     };

//     return (
//         <UserContext.Provider value={{ user, setUser, isReloaded }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         console.warn("useUser must be used within a UserProvider");
//         return {}; // Prevents destructuring errors
//     }
//     return context;
// };


"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import http_request from "../../../http-request";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isReloaded, setIsReloaded] = useState(false);
    const logoutTimerRef = useRef(null);

    // 👇 Auto Logout function
    const handleAutoLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/sign_in");
    };

    // 👇 Reset timer on user activity
    const resetInactivityTimer = () => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = setTimeout(() => {
            handleAutoLogout();
        }, 30 * 60 * 1000); // 30 minutes
    };

    // 👇 Setup inactivity listener
    useEffect(() => {
        if (!user || user?.user?.role !== "ADMIN") return;
    
        const handleUserActivity = () => {
            resetInactivityTimer();
        };
    
        // Listen to user activity
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);
        window.addEventListener("scroll", handleUserActivity);
        window.addEventListener("click", handleUserActivity);
    
        // Start the initial timer
        resetInactivityTimer();
    
        return () => {
            window.removeEventListener("mousemove", handleUserActivity);
            window.removeEventListener("keydown", handleUserActivity);
            window.removeEventListener("scroll", handleUserActivity);
            window.removeEventListener("click", handleUserActivity);
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, [user]);
    

    // useEffect(() => {
    //     const navigationEntries = window.performance.getEntriesByType("navigation");
    //     const isReload = navigationEntries.length > 0 && navigationEntries[0].type === "reload";

    //     if (isReload) setIsReloaded(true);

    //     const storedUser = localStorage.getItem("user");
    //     if (storedUser) {
    //         try {
    //             const userId = JSON.parse(storedUser)?.user?._id;
    //             if (userId) getProfileById(userId);
    //         } catch (error) {
    //             console.error("Error parsing user data from localStorage", error);
    //             router.push("/sign_in");
    //         }
    //     } else {
    //         console.log("other");
            
    //     }
    // }, [isReloaded]);

    useEffect(() => {
        const navigationEntries = window.performance.getEntriesByType("navigation");
        const isReload = navigationEntries.length > 0 && navigationEntries[0].type === "reload";
    
        if (isReload) setIsReloaded(true);
    
        const storedUser = localStorage.getItem("user");
    
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
    
        const isWarrantyActivation = currentPath.includes("warrantyActivation") && currentSearch.includes("uniqueId");
    
        if (storedUser) {
            try {
                const userId = JSON.parse(storedUser)?.user?._id;
                if (userId) {
                    getProfileById(userId);
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage", error);
                router.push("/sign_in");
            }
        } else {
            if (isWarrantyActivation) {
                console.log("other");
            } else {
                router.push("/sign_in");
            }
        }
    }, [isReloaded]);
    

    const getProfileById = async (id) => {
        try {
            const response = await http_request.get(`/getUserServerById/${id}`);
            setUser(response.data);
        } catch (err) {
            console.error("Error fetching user profile", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, isReloaded }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        console.warn("useUser must be used within a UserProvider");
        return {};
    }
    return context;
};
