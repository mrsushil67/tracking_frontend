import { Box, Grid2, Paper } from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const NotificationList = ({ notify }) => {
  const localDateTime = new Date(notify.notificationDateTime).toLocaleString();

  return (
    <div>
      <Box
        className="p-2 rounded-lg shadow-md"
        sx={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #e0e0e0",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Grid2 container >
          <Grid2 size={2}>
           <Box className="flex justify-center items-center h-full">
            {notify.notificationType === "Vehicle Stopped" ? <WarningAmberOutlinedIcon /> : <ErrorOutlineOutlinedIcon />}
           </Box>
          </Grid2>
          <Grid2 size={10}>
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-xs text-gray-800">
                {notify.notificationType}
              </div>
              <div className="text-[10px] text-gray-500">{localDateTime}</div>
            </div>
            {/* <div className="font-medium text-sm text-gray-900 mb-1">
          Vehicle: {notify.vehicleNo}
        </div> */}
            <div className="text-xs font-semibold text-gray-600">
              {notify.notificationMessage}
            </div>
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
};

export default NotificationList;
