
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import InventoryList from './inventoryList';




const Inventory = () => {

  const [inventory, setInventory] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllInventory()

  }, [refresh])

  const getAllInventory = async () => {
    try {
      let response = await http_request.get("/getAllInventory")
      let { data } = response;

      setInventory(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = inventory?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <InventoryList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Inventory