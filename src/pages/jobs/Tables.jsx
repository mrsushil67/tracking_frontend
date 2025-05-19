import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Grid2,
} from "@mui/material";
import axios from "axios";
import Moment from "moment";
import { IoSearch } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";
import JobModal from "./JobModal";

const Tables = () => {
  const [jobs, setJobs] = useState([]);
  const [searchByVehicle, setSearchByVehicle] = useState("");
  const [fromDate, setFromDate] = useState("04-01-2025");
  const [toDate, setTodate] = useState("04-30-2025");
  const [totaljobs, setTotaljobs] = useState(null);
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latlongData, setLatlongData] = useState({});
  const [jobTouchPoint, setJobTouchPoint] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [defaulString, setDefaultString] = useState("Loading...");
  const start = fromDate ? Moment(fromDate).format("DD-MM-YYYY") : "";
  const end = toDate ? Moment(toDate).format("DD-MM-YYYY") : "";
  const handlePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlerowPerPageChange = (newlimit, pageNumber) => {
    setPage(pageNumber);
    setRowPerPage(newlimit);
  };

  const columns = useMemo(() => {
    return [
      {
        name: "#SN",
        selector: (row) => row.id,
        sortable: false,
        width: "4rem",
      },
      {
        name: "CUSTOMER NAME",
        selector: (row) => row.CustomerName,
        sortable: false,
        width: "9rem",
      },
      {
        name: "TRIP SHEET",
        selector: (row) => row.TripSheet,
        sortable: false,
        width: "7rem",
      },
      {
        name: "VEHICLE No.",
        selector: (row) => row.Vehicle_no,
        sortable: false,
        width: "7rem",
      },
      {
        name: "ROUTE",
        selector: (row) => `${row.SourceCity}-${row.DestCity}`,
        sortable: false,
      },
      {
        name: "JOB START",
        selector: (row) => row.Job_Start,
        sortable: false,
        width: "9rem",
      },
      {
        name: "DEPT DATE",
        selector: (row) => row.Dept,
        sortable: false,
        width: "10rem",
      },
      {
        name: "ARR DATE",
        selector: (row) => row.Arr,
        sortable: false,
        width: "10rem",
      },
      {
        name: "TRIP TYPE",
        selector: (row) => row.TripType === 2 ? "REVERSE" : "FORWARD",
        sortable: false,
        width: "7rem",
      },
    ];
  }, []);

  const getalljobs = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * rowPerPage; // Calculate offset

      // Constructing query parameters dynamically
      let queryParams = `skip=${skip}&take=${rowPerPage}`;

      if (start && end) {
        queryParams += `&formdate=${start}&Todate=${end}`;
      }
      if (searchByVehicle) {
        queryParams += `&vehicle=${searchByVehicle}`;
      }

      console.log("Query Params:", queryParams);

      const response = await axios.get(
        `https://rcm.snaptrak.tech/VehicleJobList?${queryParams}`
      );

      setJobs(response.data.data);
      setTotaljobs(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleRowClicked = (jobData) => {
    fetchJobRout(jobData.id);
    console.log("jobData : ", jobData);
    setSelectedJob(jobData);
    setIsOpen(true);
  };
  const fetchJobRout = async (id) => {
    try {
      const response = await axios.get(
        `https://rcm.snaptrak.tech/VehicleJobListDeatils?id=${id}`
      );

      console.log(response.data.trip);
      console.log(response.data.touch);

      setLatlongData(response.data.trip);
      setJobDetails(response.data.trip);
      setJobTouchPoint(response.data.touch);
    } catch (error) {
      console.error("Error fetching job route:", error);
    }
  };

  // Run `getalljobs` when any filter changes
  useEffect(() => {
    getalljobs();
  }, [start, end, page, rowPerPage, searchByVehicle]);

  useEffect(() => {
    if (loading === true) {
      setDefaultString("Loading...");
    } else {
      setDefaultString("There is no data to display");
    }
  }, [loading]);

  const handleRefresh = () => {
    console.log("refresh");
    setSearchByVehicle("");
    setFromDate("04-01-2025");
    setTodate("04-30-2025");
  };

  return (
    <div className="h-[100%] p-5 bg-gray-100">
      <Box
        sx={{
          marginBottom: 2,
          padding: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid2
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid2 item>
            <Typography variant="h6">
              Total Jobs: <span className="text-[#fc6a2a]">{totaljobs}</span>
            </Typography>
          </Grid2>
          <Grid2 item>
            <Grid2 container spacing={2} alignItems="center">
              <Grid2 item>
                <TextField
                  size="small"
                  placeholder="Search by vehicle"
                  variant="outlined"
                  value={searchByVehicle}
                  onChange={(e) => setSearchByVehicle(e.target.value)}
                />
              </Grid2>
              <Grid2 item>
                <TextField
                  size="small"
                  // label="from"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Grid2>

              <Grid2 item>
                <TextField
                  size="small"
                  // label="To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={toDate}
                  onChange={(e) => setTodate(e.target.value)}
                />
              </Grid2>
              <Grid2 item>
                <BiRefresh
                  className="text-4xl border border-gray-400 rounded cursor-pointer"
                  onClick={handleRefresh}
                />
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
      <Box
        sx={{
          borderRadius: 1.5,
          border: "1px solid black",
          width: "100%", // Ensure table takes full width
          overflowX: "auto", // Allow horizontal scrolling if needed
        }}
      >
        <DataTable
          columns={columns}
          data={jobs}
          noDataComponent={defaulString}
          pagination
          dense
          paginationPerPage={rowPerPage}
          paginationTotalRows={totaljobs} // Adjust this dynamically based on server response
          paginationServer
          onChangePage={handlePage}
          onChangeRowsPerPage={handlerowPerPageChange}
          onRowClicked={handleRowClicked}
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#fc6a2a",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                paddingTop: "10px", // Adjust padding to increase height
                paddingBottom: "10px",
                lineHeight: "15px", // Adjust line height for spacing
              },
            },
            cells: {
              style: {
                fontSize: "11px", // Reduce font size for data cells
              },
            },
          }}
          style={{
            tableLayout: "fixed", // Ensures consistent column widths
          }}
        />
      </Box>
      <JobModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        selectedJob={selectedJob}
        latlongData={latlongData}
        jobTouchPoint={jobTouchPoint}
        jobDetails={jobDetails}
        setLatlongData={setLatlongData}
      />
    </div>
  );
};

export default Tables;
