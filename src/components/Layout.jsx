import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import "./layout.css";
import Notification from "../navbar/Notification";
import TotalVehiclesCount from "../navbar/TotalVehiclesCount";
import SearchBar from "../navbar/SearchBar";
import SideBar from "./SideBar";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container flex flex-col h-screen">
      <div className="navbar bg-gray-100 text-black flex justify-between items-center p-3 fixed top-0 z-50 border-b-1 border-gray-300 w-full">
        <div className="flex text-gray-700 items-center gap-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <IoClose size={25} /> : <IoMenu size={25} />}
          </button>
          <img
            src="https://snaptrak.tech/assets/images/snap1.png"
            onClick={() => navigate("/")}
            alt="logo"
            className="w-30 h-auto cursor-pointer"
          />
        </div>
        {/* Right Side: Search Box */}
        <div className="flex items-center space-x-3">
          <div>
            <TotalVehiclesCount />
          </div>
          <div>
            <SearchBar />
          </div>
          <div>
            <Notification />
          </div>
        </div>
      </div>

      <div className="content-container flex flex-grow pt-10 md:pt-13 lg:pt-16 h-full">
        <SideBar isSidebarOpen={isSidebarOpen} />
        <div className="main-content flex-grow overflow-auto">
          <Outlet context={[]} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
