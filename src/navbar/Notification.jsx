import { Badge, Box, Button, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import NotificationList from "../components/NotificationList";
import axios from "axios";
import config from "../config/services";
import socket from "../services/socket";

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
   const [notification, setNotification] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const totalNotification = [...notification, ...notifications];

  // functions for notifiction list open
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

   const getAllNotifications = async () => {
      const response = await axios.get(
        `${config.host}${config.getAllNotifications.url}`
      );
      if (response.status === 200) {
        setNotification(response.data);
      }
    };
  
    useEffect(() => {
      getAllNotifications();
      socket.on("notification", (data) => {
        setNotifications((prevNotifications) => [...prevNotifications, data]);
      });
    }, [socket]);

  const markAllAsRead = async () => {
    try {
      const response = await axios.post(
        `${config.host}${config.markAllNotaficationAsRead.url}`
      );
      if (response.status === 200) {
        setNotification([]);
        setNotifications([]);
        setAnchorEl(null);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  return (
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
          sx={{ marginTop: 3 }}
        >
          <Box className="bg-gray-100">
            <Box className="flex justify-between items-center px-3 pt-2">
              <Box className="font-bold text-[#fc6a2a]">Notifications - </Box>
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
                  <Box className="m-1" key={index}>
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
                Clear All
              </Button>
            </Box>
          </Box>
        </Popover>
      )}
    </div>
  );
};

export default Notification;
