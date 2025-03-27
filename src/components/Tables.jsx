import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  TextField,
  Typography,
  Grid,
} from "@mui/material";

const Tables = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    setJobs([
      {
        sl: 1,
        job_description: "enkasi-Chennai 08:35PM-07:09AM-109968",
        vehicleNo: "TN05CB8506",
        job_start: "2024-10-15T20:35:00.000Z",
        createAt: "2024-10-15 13:50:36",
        updateAt: "2024-10-15 13:50:36",
      },
      {
        sl: 2,
        job_description: "Madurai-Coimbatore 06:00AM-11:45AM-209865",
        vehicleNo: "TN12DE3456",
        job_start: "2024-10-16T06:00:00.000Z",
        createAt: "2024-10-15 14:10:12",
        updateAt: "2024-10-15 14:10:12",
      },
      {
        sl: 3,
        job_description: "Trichy-Erode 09:15AM-02:30PM-305678",
        vehicleNo: "TN09AB7654",
        job_start: "2024-10-17T09:15:00.000Z",
        createAt: "2024-10-15 14:25:20",
        updateAt: "2024-10-15 14:25:20",
      },
      {
        sl: 4,
        job_description: "Salem-Thanjavur 07:45PM-01:10AM-407345",
        vehicleNo: "TN06GH4321",
        job_start: "2024-10-18T19:45:00.000Z",
        createAt: "2024-10-15 14:40:45",
        updateAt: "2024-10-15 14:40:45",
      },
      {
        sl: 5,
        job_description: "Vellore-Kanyakumari 05:30AM-03:55PM-508432",
        vehicleNo: "TN02JK8765",
        job_start: "2024-10-19T05:30:00.000Z",
        createAt: "2024-10-15 15:05:36",
        updateAt: "2024-10-15 15:05:36",
      },
      {
        sl: 6,
        job_description: "Chennai-Madurai 10:15PM-06:30AM-609123",
        vehicleNo: "TN04LM5432",
        job_start: "2024-10-20T22:15:00.000Z",
        createAt: "2024-10-15 15:20:50",
        updateAt: "2024-10-15 15:20:50",
      },
      {
        sl: 7,
        job_description: "Erode-Namakkal 01:00PM-03:15PM-701234",
        vehicleNo: "TN10NO9876",
        job_start: "2024-10-21T13:00:00.000Z",
        createAt: "2024-10-15 15:35:10",
        updateAt: "2024-10-15 15:35:10",
      },
      {
        sl: 8,
        job_description: "Coimbatore-Trichy 04:45AM-09:20AM-809876",
        vehicleNo: "TN11PQ6543",
        job_start: "2024-10-22T04:45:00.000Z",
        createAt: "2024-10-15 15:50:22",
        updateAt: "2024-10-15 15:50:22",
      },
      {
        sl: 9,
        job_description: "Thanjavur-Vellore 07:10AM-02:45PM-908543",
        vehicleNo: "TN08RS3210",
        job_start: "2024-10-23T07:10:00.000Z",
        createAt: "2024-10-15 16:05:15",
        updateAt: "2024-10-15 16:05:15",
      },
      {
        sl: 10,
        job_description: "Kanyakumari-Salem 09:20PM-06:30AM-100765",
        vehicleNo: "TN07TU7654",
        job_start: "2024-10-24T21:20:00.000Z",
        createAt: "2024-10-15 16:20:48",
        updateAt: "2024-10-15 16:20:48",
      },
      {
        sl: 11,
        job_description: "Chennai-Pondicherry 06:00AM-08:30AM-110234",
        vehicleNo: "TN03VW5432",
        job_start: "2024-10-25T06:00:00.000Z",
        createAt: "2024-10-15 16:35:29",
        updateAt: "2024-10-15 16:35:29",
      },
      {
        sl: 12,
        job_description: "Pondicherry-Madurai 02:30PM-08:15PM-120654",
        vehicleNo: "TN14XY7890",
        job_start: "2024-10-26T14:30:00.000Z",
        createAt: "2024-10-15 16:50:42",
        updateAt: "2024-10-15 16:50:42",
      },
      {
        sl: 13,
        job_description: "Salem-Coimbatore 07:45AM-10:30AM-130897",
        vehicleNo: "TN13ZA5678",
        job_start: "2024-10-27T07:45:00.000Z",
        createAt: "2024-10-15 17:05:33",
        updateAt: "2024-10-15 17:05:33",
      },
      {
        sl: 14,
        job_description: "Namakkal-Trichy 03:00PM-06:00PM-140432",
        vehicleNo: "TN15BC8765",
        job_start: "2024-10-28T15:00:00.000Z",
        createAt: "2024-10-15 17:20:21",
        updateAt: "2024-10-15 17:20:21",
      },
      {
        sl: 15,
        job_description: "Vellore-Chennai 05:15AM-07:30AM-150210",
        vehicleNo: "TN16DE5432",
        job_start: "2024-10-29T05:15:00.000Z",
        createAt: "2024-10-15 17:35:57",
        updateAt: "2024-10-15 17:35:57",
      },
      {
        sl: 1,
        job_description: "enkasi-Chennai 08:35PM-07:09AM-109968",
        vehicleNo: "TN05CB8506",
        job_start: "2024-10-15T20:35:00.000Z",
        createAt: "2024-10-15 13:50:36",
        updateAt: "2024-10-15 13:50:36",
      },
      {
        sl: 2,
        job_description: "Madurai-Coimbatore 06:00AM-11:45AM-209865",
        vehicleNo: "TN12DE3456",
        job_start: "2024-10-16T06:00:00.000Z",
        createAt: "2024-10-15 14:10:12",
        updateAt: "2024-10-15 14:10:12",
      },
      {
        sl: 3,
        job_description: "Trichy-Erode 09:15AM-02:30PM-305678",
        vehicleNo: "TN09AB7654",
        job_start: "2024-10-17T09:15:00.000Z",
        createAt: "2024-10-15 14:25:20",
        updateAt: "2024-10-15 14:25:20",
      },
      {
        sl: 4,
        job_description: "Salem-Thanjavur 07:45PM-01:10AM-407345",
        vehicleNo: "TN06GH4321",
        job_start: "2024-10-18T19:45:00.000Z",
        createAt: "2024-10-15 14:40:45",
        updateAt: "2024-10-15 14:40:45",
      },
      {
        sl: 5,
        job_description: "Vellore-Kanyakumari 05:30AM-03:55PM-508432",
        vehicleNo: "TN02JK8765",
        job_start: "2024-10-19T05:30:00.000Z",
        createAt: "2024-10-15 15:05:36",
        updateAt: "2024-10-15 15:05:36",
      },
      {
        sl: 6,
        job_description: "Chennai-Madurai 10:15PM-06:30AM-609123",
        vehicleNo: "TN04LM5432",
        job_start: "2024-10-20T22:15:00.000Z",
        createAt: "2024-10-15 15:20:50",
        updateAt: "2024-10-15 15:20:50",
      },
      {
        sl: 7,
        job_description: "Erode-Namakkal 01:00PM-03:15PM-701234",
        vehicleNo: "TN10NO9876",
        job_start: "2024-10-21T13:00:00.000Z",
        createAt: "2024-10-15 15:35:10",
        updateAt: "2024-10-15 15:35:10",
      },
      {
        sl: 8,
        job_description: "Coimbatore-Trichy 04:45AM-09:20AM-809876",
        vehicleNo: "TN11PQ6543",
        job_start: "2024-10-22T04:45:00.000Z",
        createAt: "2024-10-15 15:50:22",
        updateAt: "2024-10-15 15:50:22",
      },
      {
        sl: 9,
        job_description: "Thanjavur-Vellore 07:10AM-02:45PM-908543",
        vehicleNo: "TN08RS3210",
        job_start: "2024-10-23T07:10:00.000Z",
        createAt: "2024-10-15 16:05:15",
        updateAt: "2024-10-15 16:05:15",
      },
      {
        sl: 10,
        job_description: "Kanyakumari-Salem 09:20PM-06:30AM-100765",
        vehicleNo: "TN07TU7654",
        job_start: "2024-10-24T21:20:00.000Z",
        createAt: "2024-10-15 16:20:48",
        updateAt: "2024-10-15 16:20:48",
      },
      {
        sl: 11,
        job_description: "Chennai-Pondicherry 06:00AM-08:30AM-110234",
        vehicleNo: "TN03VW5432",
        job_start: "2024-10-25T06:00:00.000Z",
        createAt: "2024-10-15 16:35:29",
        updateAt: "2024-10-15 16:35:29",
      },
      {
        sl: 12,
        job_description: "Pondicherry-Madurai 02:30PM-08:15PM-120654",
        vehicleNo: "TN14XY7890",
        job_start: "2024-10-26T14:30:00.000Z",
        createAt: "2024-10-15 16:50:42",
        updateAt: "2024-10-15 16:50:42",
      },
      {
        sl: 13,
        job_description: "Salem-Coimbatore 07:45AM-10:30AM-130897",
        vehicleNo: "TN13ZA5678",
        job_start: "2024-10-27T07:45:00.000Z",
        createAt: "2024-10-15 17:05:33",
        updateAt: "2024-10-15 17:05:33",
      },
      {
        sl: 14,
        job_description: "Namakkal-Trichy 03:00PM-06:00PM-140432",
        vehicleNo: "TN15BC8765",
        job_start: "2024-10-28T15:00:00.000Z",
        createAt: "2024-10-15 17:20:21",
        updateAt: "2024-10-15 17:20:21",
      },
      {
        sl: 15,
        job_description: "Vellore-Chennai 05:15AM-07:30AM-150210",
        vehicleNo: "TN16DE5432",
        job_start: "2024-10-29T05:15:00.000Z",
        createAt: "2024-10-15 17:35:57",
        updateAt: "2024-10-15 17:35:57",
      },
    ]);
  }, []);

  const filteredJobs = jobs.filter((user) =>
    user.vehicleNo.includes(search) &&
    (dateFilter === "" || user.job_start.startsWith(dateFilter))
  );

  const columns = useMemo(() => {
    return [
      { name: "SL#", selector: (row) => row.sl, sortable: true, grow: -2 },
      {
        name: "JOB DESCRIPTION",
        selector: (row) => row.job_description,
        sortable: false,
        grow: 2,
      },
      {
        name: "VEHICLE NUMBER",
        selector: (row) => row.vehicleNo,
        sortable: true,
      },
      { name: "JOB START", selector: (row) => row.job_start, sortable: true },
      { name: "CREATE AT", selector: (row) => row.createAt, sortable: true },
      { name: "UPDATE AT", selector: (row) => row.updateAt, sortable: true },
    ];
  }, []);

  return (
    <div className="border h-[100%] p-5 bg-gray-100">
      <Box sx={{ marginBottom: 2, padding: 2, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">Total Jobs: 678</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  size="small"
                  label="Search by Vehicle No"
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  label="Filter by Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ borderRadius: 1.5, border: "1px solid black" }}>
        <DataTable
          columns={columns}
          data={jobs}
          pagination
          dense
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#fc8403",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "bold",
                paddingTop: "12px",  // Adjust padding to increase height
                paddingBottom: "12px",
                lineHeight: "20px",  // Adjust line height for spacing
              }
            }
          }}
        />


      </Box>
    </div>
  );
};

export default Tables;
