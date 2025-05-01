import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import { FaHome, FaList } from "react-icons/fa";
import "./layout.css";
import Notification from "../navbar/Notification";
import { useGlobleContext } from "../globle/context";
import TotalVehiclesCount from "../navbar/TotalVehiclesCount";
import SearchBar from "../navbar/SearchBar";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container flex flex-col h-screen">
      <div className="navbar bg-gray-100 text-black flex justify-between items-center p-3 fixed top-0 z-50 border-b-1 w-full">
        <div className="flex text-gray-700 items-center gap-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <IoClose size={25} /> : <IoMenu size={25} />}
          </button>
          <img
            src="https://snaptrak.tech/assets/images/snap1.png"
            onClick={() => navigate("/")}
            alt="logo"
            className="w-30 h-auto"
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
        <div
          className={`sidebar bg-gray-100 text-black flex flex-col p-2 transition-all duration-400 ${
            isSidebarOpen ? "sidebar-open w-64" : "sidebar-closed w-16"
          }`}
        >
          <Link
            to="/"
            className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3"
          >
            <FaHome size={18} />
            {isSidebarOpen && <span>Home</span>}
          </Link>
          <Link
            to="/alljobs"
            className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3"
          >
            <FaList size={18} />
            {isSidebarOpen && <span>Jobs</span>}
          </Link>

          {/* <div className="relative">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center items-center gap-3 w-full">
              <FaCog size={18} />
              {isSidebarOpen && <span>Settings</span>}
              {isSidebarOpen && <FaChevronDown size={15} className={`ml-auto ${isDropdownOpen ? "rotate-180" : ""}`} />}
            </button>
            {isDropdownOpen && isSidebarOpen && (
              <div className="bg-gray-800 text-white p-2 rounded mt-2 ml-5 space-y-2">
                <Link to="/settings/profile" className="block hover:bg-gray-700 p-2 rounded">Profile Settings</Link>
                <Link to="/settings/account" className="block hover:bg-gray-700 p-2 rounded">Account Settings</Link>
              </div>
            )}
          </div> */}
        </div>

        <div className="main-content flex-grow overflow-auto">
          <Outlet context={[]} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
