"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import http_request from "../../../http-request"


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userId=JSON.parse(storedUser);
            getProfileById(userId?.user?._id)
        }
    }, [user]);

    const getProfileById = async (id) => {
        try {
            const response = await http_request.get(`/getUserServerById/${id}`)
            const { data } = response;
            setUser(data)
        }
        catch (err) {
            console.log(err);

        }
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
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
