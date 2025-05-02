import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox, Grid2, Popover } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobleContext } from "../globle/context";

const VehicleStatus = ({
  vehicleStatus,
  hoverVehicleCount,
  setHoverVehicleCount,
  openVehicleStatusFilter,
  id2,
}) => {
  const { filterByStatus, setFilterByStatus } = useGlobleContext();
  const handleCheckboxChange = (status) => {
    const updatedStatus = filterByStatus.includes(status)
      ? filterByStatus.filter((item) => item !== status)
      : [...filterByStatus, status];

    setFilterByStatus(updatedStatus.length > 0 ? updatedStatus : []); // ✅ Ensure empty array if all unchecked
  };

  // useEffect(() => {
  //   if(filterByStatus.length === 0){
  //     console.log("ye abhi nahi chalega")
  //     setFilterByStatus([])
  //   }
  // },[filterByStatus])

  const handleClose = () => {
    setHoverVehicleCount(null);
  };

  return (
    <div>
      <Popover
        id={id2}
        open={openVehicleStatusFilter}
        onClose={handleClose}
        anchorEl={hoverVehicleCount}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ marginTop: 3 }}
      >
        <Box className="p-3">
          <Box className="flex justify-between">
            <Box className="font-bold">Filter Vehicles</Box>
            <Box>
                <CloseIcon sx={{cursor: "pointer"}} onClick={handleClose} />
              </Box>
          </Box>
          <Grid2 container spacing={1} width={450}>
            {vehicleStatus.map((status, index) => (
              <Grid2 key={index} size={6}>
                <Box className="flex justify-start items-center">
                  <Checkbox 
                    size="small"
                    checked={filterByStatus.includes(status.status)}
                    onChange={() => handleCheckboxChange(status.status)}
                  />
                  <span className={status.status === "RUNNING" ? `text-green-700 text-sm font-bold pr-1` : status.status === "IDLE" ? 'text-yellow-500 text-sm font-bold pr-1' : 'text-red-700 text-sm font-bold pr-1'}>{status.count} </span>
                  <span className="text-sm text-gray-700">{status.status}</span>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Popover>
    </div>
  );
};

export default VehicleStatus;
