 "use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { io } from 'socket.io-client';

const socketContext=createContext();
 

export const useSocketContext=()=>{
    return useContext(socketContext)
}

 export  const SocketProvider=({children})=>{
    const [socket,setSocket]=useState(null);
    const [onlineUsers,setOnlineUsers]=useState([]);
    const {user}=useUser();

const originUrl="https://crm-backend-weld-pi.vercel.app" 

// const originUrl="http://localhost:5000"

useEffect(()=>{
   if(user){
    const socket=io(originUrl,{
       query:{ userId:user?.user?._id,
       },
    });
    setSocket(socket)
    socket.on("getOnline",(users)=>{
        setOnlineUsers(users)
        console.log("getOnline",users)
    });
    return ()=> socket.close();
   }
   else{
    if(socket){
        socket.close();
        setSocket(null);
    }
   }
},[user])
return (
    <socketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </socketContext.Provider>
)

}