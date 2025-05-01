import React, { useState } from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox, Grid2, Popover } from "@mui/material";

const VehicleStatus = ({
  vehicleStatus,
  hoverVehicleCount,
  setHoverVehicleCount,
  openVehicleStatusFilter,
  id2,
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleCheckboxChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const handleClose = () => {
    setHoverVehicleCount(null);
  };

  console.log("Selected Statuses", selectedStatuses);

  const statuses = [
    { label: "123 Running", value: "running" },
    { label: "14 Parked", value: "parked" },
    { label: "67 Unreachable", value: "unreachable" },
    { label: "289 Idle", value: "idle" },
    { label: "9 Battery Discharge", value: "batteryDischarge" },
    { label: "16 Not Available", value: "notAvailable" },
  ];

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
        sx={{marginTop: 3}}
      >
        <Box className="p-2">
          <Grid2 container spacing={1} width={500}>
            {vehicleStatus.map((status, index) => (
              <Grid2 key={index} size={6}>
                <Box className="flex justify-start items-center">
                  <Checkbox
                    checked={selectedStatuses.includes(status.status)}
                    onChange={() => handleCheckboxChange(status.status)}
                  />
                  <span className="pr-1 font-bold">{status.count} </span>
                  <span>{status.status}</span>
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
