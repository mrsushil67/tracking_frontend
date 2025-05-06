import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

const VehicleCardSkeleton = () => {
  return (
    <div className="vehicle-card my-2">
      <Stack spacing={1}>
        <Skeleton
          variant="rounded"
          sx={{ fontSize: "18px" }}
          className="w-3/8"
        />
        <Box className="flex">
          <Skeleton
            variant="circular"
            width={15}
            height={15}
            className="mx-1"
          />
          <Skeleton
            variant="rectangular"
            width={160}
            height={15}
            className="mx-1"
          />
        </Box>
        <Box className="flex">
          <Skeleton
            variant="circular"
            width={15}
            height={15}
            className="mx-1"
          />
          <Skeleton
            variant="rectangular"
            width={70}
            height={15}
            className="mx-1"
          />
        </Box>
        <Box className="flex">
          <Skeleton
            variant="circular"
            width={15}
            height={15}
            className="mx-1"
          />
          <Skeleton
            variant="rectangular"
            width={220}
            height={15}
            className="mx-1"
          />
        </Box>
      </Stack>
    </div>
  );
};

export default VehicleCardSkeleton;
