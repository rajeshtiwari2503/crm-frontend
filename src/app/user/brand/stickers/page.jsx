"use client";
import Sidenav from "@/app/components/Sidenav";
import React, { useEffect, useState } from "react";
import http_request from ".././../../../http-request";
import StickersList from "./StickersList";
import { ReactLoader } from "@/app/components/common/Loading";

const Stickers = () => {
  const [stickers, setStickers] = useState([]);
 
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    getAllStickers
  }, [ ]);

   

  const getAllStickers = async () => {
    try {
        const storedValue = localStorage.getItem("user");
        const user1 = JSON.parse(storedValue);
      const response = await http_request.get(`/getAllProductWarrantyById/${user1?._id}`);
      const { data } = response;
      setStickers(data);
    } catch (error) {
      console.error("Error fetching Stickers data:", error.message);
    }
  };

  

   

  const data = stickers?.map((item, index) => ({ ...item, i: index + 1 }));

   

  return (
    <>
      <Sidenav>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ReactLoader />
          </div>
        ) : (
          <StickersList
            data={data}
        
          />
        )}
      </Sidenav>
    </>
  );
};

export default Stickers;
