import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaList } from "react-icons/fa";
import { Box } from "@mui/material";

const SideBar = ({ isSidebarOpen }) => {
  const sidebarComponent = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Jobs", path: "/alljobs", icon: <FaList /> },
  ];

  return (
    <div
      className={`sidebar bg-gray-100  text-black flex flex-col p-2 transition-all duration-400 border-r-1 border-gray-300 ${
        isSidebarOpen ? "sidebar-open w-64" : "sidebar-closed w-16"
      }`}
    >
      {sidebarComponent.map((items) => (
        <Link
          to={items.path}
          className="hover:bg-gray-300 text-gray-700 p-2 rounded flex items-center gap-3"
        >
          <Box fontSize={20}>{items.icon}</Box>
          {isSidebarOpen && <span>{items.name}</span>}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
