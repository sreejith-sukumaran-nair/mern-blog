import React, { useEffect, useState } from 'react'

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';


function DashSidebar() {
  const location = useLocation();
  const [tab,setTab] = useState('');
  
  
  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams)
    const tabFromURL = urlParams.get('tab');
    if(tabFromURL){
      setTab(tabFromURL)
    }
  },[location.search])
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
          <Sidebar.Item active = {tab ==='profile'} href="#" icon={HiUser} label = "User" labelColor='dark'>
            Profile
          </Sidebar.Item>
          </Link>
        
          <Sidebar.Item href="#" icon={HiArrowSmRight} className= "cursor-pointer">
            Sign out
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar