import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import Moment from "moment";
import { IoSearch } from "react-icons/io5";
import JobModal from "./JobModal";

const Tables = () => {
  const [jobs, setJobs] = useState([]);
  const [searchByVehicle, setSearchByVehicle] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setTodate] = useState("");
  const [totaljobs, setTotaljobs] = useState(null);
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [defaulString, setDefaultString] = useState("Loading...")
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
      { name: "SL#", selector: (row) => row.id, sortable: false, width: "5rem" },
      {
        name: "JOB DESCRIPTION",
        selector: (row) => `${row.SourceCity}-${row.DestCity}-${row.TripSheet}`,
        sortable: false,
      },
      {
        name: "VEHICLE No.",
        selector: (row) => row.Vehicle_no,
        sortable: false,
        width: "11rem",
      },
      {
        name: "JOB START",
        selector: (row) => row.Job_Start,
        sortable: false,
        width: "11rem",
      },
      {
        name: "CREATE AT",
        selector: (row) => row.createdAt,
        sortable: false,
        width: "11rem",
      },
      {
        name: "UPDATE AT",
        selector: (row) => row.updatedAt,
        sortable: false,
        width: "11rem",
      },
    ];
  }, []);

  const getalljobs = async () => {
    try {
      setLoading(true)
      const skip = (page - 1) * rowPerPage; // Calculate offset

      // Constructing query parameters dynamically
      let queryParams = `skip=${skip}&take=${rowPerPage}`;

      if (start && end) {
        queryParams += `&formdate=${start}&Todate=${end}`;
      }
      if (searchByVehicle) {
        queryParams += `&vehicle=${searchByVehicle}`;
      }

      // console.log("Query Params:", queryParams);

      const response = await axios.get(
        `http://103.239.89.132/RCM/VehicleJobList?${queryParams}`
      );

      setJobs(response.data.data);
      setTotaljobs(response.data.total);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleRowClicked = (jobData) => {
    console.log("JobData : ",jobData)
    setSelectedJob(jobData)
    setIsOpen(true)
  };

  // Run `getalljobs` when any filter changes
  useEffect(() => {
    getalljobs();
  }, [start, end, page, rowPerPage, searchByVehicle]);

  useEffect(() => {
  if(loading === true){
    setDefaultString("Loading...")
  }else{
    setDefaultString('There is no data to display')
  }
},[loading])


  return (
    <div className="border h-[100%] p-5 bg-gray-100">
      <Box
        sx={{
          marginBottom: 2,
          padding: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h6">
              Total Jobs: <span className="text-amber-600">{totaljobs}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  size="small"
                  placeholder="Search by vehicle"
                  variant="outlined"
                  value={searchByVehicle}
                  onChange={(e) => setSearchByVehicle(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  // label="from"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Grid>

              <Grid item>
                <TextField
                  size="small"
                  // label="To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={toDate}
                  onChange={(e) => setTodate(e.target.value)}
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
                backgroundColor: "#fc8403",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "bold",
                paddingTop: "12px", // Adjust padding to increase height
                paddingBottom: "12px",
                lineHeight: "20px", // Adjust line height for spacing
              },
            },
          }}
        />
      </Box>
      <JobModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} selectedJob={selectedJob}/>
    </div>
  );
};

export default Tables;
