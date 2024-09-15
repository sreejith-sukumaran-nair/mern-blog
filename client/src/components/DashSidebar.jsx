import React, { useEffect, useState } from 'react'

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiDocumentText, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


function DashSidebar() {
  const location = useLocation();
  const [tab,setTab] = useState('');
  const {currentUser} = useSelector((state) => state.user)

  const dispatch = useDispatch()
  
  
  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if(tabFromURL){
      setTab(tabFromURL)
    }
  },[location.search])

  const handleSignout = async() => {
    try {
      const res = await fetch('/api/user/signout' , {
        method : 'POST' ,
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signoutSuccess())
        localStorage.removeItem('currentUserInLoacalStorage')
      }

    } catch (error) {
      console.log(error.message)
      
    }
  }
  return (
    <Sidebar className="w-full md:w-56 shadow-md">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
          <Sidebar.Item as = "div"  active = {tab ==='profile'} href="#" icon={HiUser} label = {currentUser?.isAdmin ? 'Admin' : 'User'} labelColor='dark'>
            Profile
          </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
        
          <Sidebar.Item  href="#" icon={HiArrowSmRight}  className= "cursor-pointer">
            <span onClick={handleSignout}>Sign out </span>
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar