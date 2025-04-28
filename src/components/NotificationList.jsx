import { Box } from "@mui/material";
import React from "react";

const NotificationList = ({notify}) => {
  return (
    <div>
      <Box className="p-2">
        <div className="font-bold text-sm">{notify.title}</div>
        <div className="text-xs">{notify.description}</div>
        <div className="font-bold text-sm text-gray-500">{notify.time}</div>
      </Box>
    </div>
  );
};

export default NotificationList;
