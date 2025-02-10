 "use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import http_request from "../../../http-request";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isReloaded, setIsReloaded] = useState(false);

    useEffect(() => {
        // Detect window reload
        const navigationEntries = window.performance.getEntriesByType("navigation");
        const isReload = navigationEntries.length > 0 && navigationEntries[0].type === "reload";
// console.log("isReload",isReload);

        if (isReload) {
            setIsReloaded(true); // Set state if the page was reloaded
        }

        // Always check localStorage for user data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userId = JSON.parse(storedUser)?.user?._id;
                if (userId) {
                    getProfileById(userId);
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage", error);
            }
        }
    }, [isReloaded]); // Runs once when component mounts

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
        return {}; // Prevents destructuring errors
    }
    return context;
};
