import React from 'react'
import { SideBar } from './SideBar'
import Footer from './Footer'
import NavBar from './NavBar'
import {Outlet} from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <SideBar/>
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <NavBar/>
            <Outlet/>
            <Footer/>
        </main>
    </div>
  )
}

export default Layout