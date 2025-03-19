import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaHome, FaUser, FaMapMarkerAlt, FaCog, FaChevronDown } from "react-icons/fa";
import "./layout.css";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="layout-container h-screen w-screen flex flex-col">
      <div className="navbar bg-gray-100 text-black flex justify-between items-center p-4 fixed top-0 z-50 border-b-1">
        <div className="flex text-gray-700 items-center gap-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <IoClose size={25} /> : <IoMenu size={25} />}
          </button>
          <img src="https://snaptrak.tech/assets/images/snap1.png" alt="logo" className="w-30"/>
        </div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </div>
      </div>

      <div className="content-container flex flex-grow mt-14">
        <div className={`sidebar bg-gray-100 text-black flex flex-col p-2 transition-all duration-400 ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Link to="/" className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3">
            <FaHome size={18} />
            {isSidebarOpen && <span>Home</span>}
          </Link>
          <Link to="/test" className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3">
            <FaUser size={18} />
            {isSidebarOpen && <span>Profile</span>}
          </Link>
          <Link to="/location" className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3">
            <FaMapMarkerAlt size={18} />
            {isSidebarOpen && <span>Location</span>}
          </Link>
          
          <div className="relative">
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
          </div>
        </div>

        <div className="main-content flex-grow p-[1px] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
