
"use client"
import React, { useEffect, useState } from 'react'
 
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import AnalyticsDashboard from './inventoryAnalytics';
 




const Inventory = () => {

  

  return (
    <Sidenav>
      <Toaster />
      <>
        {/* <InventoryList data={data} RefreshData={RefreshData} /> */}
        <AnalyticsDashboard  />
      </>
    </Sidenav>
  )
}

export default Inventory