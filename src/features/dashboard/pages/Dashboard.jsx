import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Activity, Thermometer, Droplets, Zap } from "lucide-react";
import { updateMetrics, updateSensorData } from "../store/dashboardSlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./../../../services/firebase/config"; 

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { metrics, sensorData } = useSelector((state) => state.dashboard);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const userId = "6767698asd87"; // This should come from your auth system
  const storagePath = `diagrams/${userId}/`;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const storageRef = ref(storage, storagePath);
        const result = await listAll(storageRef);
        
        const filePromises = result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            id: item.name,
            name: item.name,
            fullPath: item.fullPath,
            url,
            createdTime: new Date().toISOString(), // You might want to use metadata instead
          };
        });

        const fileList = await Promise.all(filePromises);
        setFiles(fileList);
        setLoading(false);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError("Failed to fetch files");
        setLoading(false);
        console.error(err);
      }
    };

    fetchFiles();
  }, [storagePath]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const fileRef = ref(storage, `${storagePath}${fileId}`);
      await deleteObject(fileRef);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (err) {
      setError("Failed to delete file");
      console.error(err);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download file");
      console.error(err);
    }
  };

  const filteredRows = files.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const totalDevices = devices.length;
    const activeDevices = devices.filter((d) => d.status === "online").length;
    const offlineDevices = totalDevices - activeDevices;

    dispatch(
      updateMetrics({
        totalDevices,
        activeDevices,
        offlineDevices,
        alerts: Math.floor(Math.random() * 5),
      })
    );

    const mockData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      power: 50 + Math.random() * 30,
    }));

    dispatch(updateSensorData(mockData));
  }, [devices, dispatch]);

  const metricCards = [
    {
      icon: Activity,
      label: "Total Devices",
      value: metrics.totalDevices,
      color: "blue",
    },
    {
      icon: Thermometer,
      label: "Active Devices",
      value: metrics.activeDevices,
      color: "green",
    },
    {
      icon: Droplets,
      label: "Offline Devices",
      value: metrics.offlineDevices,
      color: "red",
    },
    { icon: Zap, label: "Alerts", value: metrics.alerts, color: "orange" },
  ];

  const handleAddClick = () => {
    navigate("/dashboard/edit");
  };

  const handleEditClick = (fileId) => {
    navigate(`/dashboard/edit/${fileId}`);
  };

  return (
    <div className="dashboard">
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Last Updated: {lastUpdated || "Never"}
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" padding={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ padding: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={search}
                onChange={handleSearchChange}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
              >
                Add
              </Button>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created Time</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{new Date(row.createdTime).toLocaleString()}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleEditClick(row.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDownload(row.url, row.name)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No files found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        )}
      </Box>
    </div>
  );
};