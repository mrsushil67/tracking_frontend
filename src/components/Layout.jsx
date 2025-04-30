import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import { FaHome, FaList } from "react-icons/fa";
import "./layout.css";
import { Badge, Box, Button, Divider, Paper, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationList from "./NotificationList";
import CloseIcon from "@mui/icons-material/Close";
import socket from "../services/socket";
import axios from "axios";
import config from "../config/services";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [vehicleno, setVehicleno] = useState("");
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [filterdCounts, setFilterdCounts] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const totalNotification = [...notification, ...notifications];

  const handleChange = (e) => {
    setVehicleno(e.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getAllNotifications = async () => {
    const response = await axios.get(`${config.host}${config.getAllNotifications.url}`);
    if (response.status === 200) {
      setNotification(response.data);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.post(`${config.host}${config.markAllNotaficationAsRead.url}`);
      if (response.status === 200) {
        setNotification([]);
        setNotifications([]);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  useEffect(() => {
    getAllNotifications();
    socket.on("message", (data) => {
      console.log("Notification:", data);
    });
    socket.on("notification", (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });
  }, [socket]);

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
          {totalVehicles > 0 ? (
            <div>
              <span className="font-bold  text-gray-700">Total Vehicles : </span>

              <span className="font-bold  text-[#fc6a2a]">
                {totalVehicles}{" "}
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
          <div className="pr-4">
            <Badge
              badgeContent={totalNotification.length}
              color="warning"
              onClick={handleClick}
            >
              <NotificationsIcon sx={{ fontSize: 30 }} color="action" />
            </Badge>
            {totalNotification.length > 0 && (
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box className="bg-gray-100">
                  <Box className="flex justify-between items-center px-3 pt-2">
                    <Box className="font-bold text-[#fc6a2a]">
                      Notifications -{" "}
                    </Box>
                    <Box>
                      <CloseIcon onClick={handleClose} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 300,
                      height: 400,
                      overflow: "scroll",
                      margin: 1,
                    }}
                  >
                    {totalNotification.length > 0 &&
                      totalNotification.toReversed().map((notify, index) => (
                        <Box className="m-1" key={notify.id}>
                          <NotificationList notify={notify} />
                          {/* {index !== notifyDetails.length - 1 && <Divider />} */}
                        </Box>
                      ))}
                  </Box>
                  <Box className="px-2 pb-2 flex justify-end">

                    <Button
                      variant="outlined"
                      size="small"
                      style={{ borderColor: "#fc6a2a", color: "#fc6a2a" }}
                      onClick={markAllAsRead}
                    >
                      Mark as Read
                    </Button>
                  </Box>
                </Box>
              </Popover>
            )}
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
          {/* <Link to="/stream" className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3">
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
