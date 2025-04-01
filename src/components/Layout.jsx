import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaCog,
  FaChevronDown,
  FaList,
} from "react-icons/fa";
import "./layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [vehicleno, setVehicleno] = useState("");
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [filterdCounts, setFilterdCounts] = useState(0);

  const handleChange = (e) => {
    setVehicleno(e.target.value);
  };

  console.log("vehicleno : ",typeof(vehicleno))
  console.log("totalVehicles : ", totalVehicles);
  console.log("filter Counts : ", filterdCounts);

  return (
    <div className="layout-container flex flex-col">
      <div className="navbar bg-gray-100 text-black flex justify-between items-center p-4 fixed top-0 z-50 border-b-1">
        <div className="flex text-gray-700 items-center gap-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <IoClose size={25} /> : <IoMenu size={25} />}
          </button>
          <img
            src="https://snaptrak.tech/assets/images/snap1.png"
            onClick={() => navigate("/")}
            alt="logo"
            className="w-30"
          />
        </div>
        {/* Right Side: Search Box */}
        <div className="flex items-center space-x-3">
          {filterdCounts > 0 ? (
            <div>
              {filterdCounts === totalVehicles ? (
                <span className="font-bold">Total : </span>
              ):(
                <span className="font-bold">Filtered : </span>
              )}
              
              <span className="font-bold  text-[#fc6a2a]">
                {filterdCounts}{" "}
              </span>
            </div>
          ) : null}
          <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              value={vehicleno}
              onChange={handleChange}
              placeholder="Search vehicle by number..."
              className="outline-none w-56 text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button className="ml-2 text-blue-600 hover:text-blue-800 transition">
              <IoSearch size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="content-container flex flex-grow mt-14">
        <div
          className={`sidebar bg-gray-100 text-black flex flex-col p-2 transition-all duration-400 ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Link
            to="/"
            className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3"
          >
            <FaHome size={18} />
            {isSidebarOpen && <span>Home</span>}
          </Link>
          {/* <Link to="/profile" className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3">
            <FaUser size={18} />
            {isSidebarOpen && <span>Profile</span>}
          </Link> */}
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
          <Outlet context={[vehicleno, setTotalVehicles, setFilterdCounts]} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
