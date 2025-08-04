import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL, getMetadata,auth } from "../../../../services/firebase/config";

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
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { Activity, Thermometer, Droplets, Zap } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { updateMetrics, updateSensorData } from "../store/dashboardSlice";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { devices } = useSelector((state) => state.devices);
  const { metrics, sensorData } = useSelector((state) => state.dashboard);
  
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const storageRef = ref(getStorage(), `users/${user.uid}/diagrams/`);
        const result = await listAll(storageRef);
        
        const filesData = await Promise.all(
          result.items.map(async (item) => {
            const [url, metadata] = await Promise.all([
              getDownloadURL(item),
              getMetadata(item)
            ]);
            
            return {
              id: item.name,
              name: item.name.replace('.joint', ''),
              downloadUrl: url,
              createdAt: new Date(metadata.timeCreated).toLocaleString(),
              size: (metadata.size / 1024).toFixed(2) + ' KB',
              ...metadata.customMetadata
            };
          })
        );

        setFiles(filesData);
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to load files");
        setLoading(false);
      }
    };

    fetchUserFiles();

    // Calculate device metrics
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status === "online").length;
    const offlineDevices = totalDevices - activeDevices;

    dispatch(updateMetrics({
      totalDevices,
      activeDevices,
      offlineDevices,
      alerts: Math.floor(Math.random() * 5)
    }));

    // Generate mock sensor data
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      power: 50 + Math.random() * 30,
    }));

    dispatch(updateSensorData(mockData));
  }, [devices, dispatch]);

  const metricCards = [
    { icon: Activity, label: "Total Devices", value: metrics.totalDevices, color: "primary.main" },
    { icon: Thermometer, label: "Active Devices", value: metrics.activeDevices, color: "success.main" },
    { icon: Droplets, label: "Offline Devices", value: metrics.offlineDevices, color: "error.main" },
    { icon: Zap, label: "Alerts", value: metrics.alerts, color: "warning.main" },
  ];

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(search.toLowerCase()) ||
    (file.title && file.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (fileId) => {
    navigate(`/dashboard/edit/${encodeURIComponent(fileId)}`);
  };

  const handleNewDiagram = () => {
    navigate("/dashboard/new");
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last Updated: {lastUpdated || "Never"}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: metric.color, color: 'common.white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <metric.icon size={32} style={{ marginRight: 16 }} />
                  <Box>
                    <Typography variant="h5">{metric.value}</Typography>
                    <Typography variant="body2">{metric.label}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Temperature & Humidity</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Power Consumption</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="power" stroke="#ffc658" name="Power (W)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              label="Search Files"
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearchChange}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewDiagram}
            >
              New Diagram
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : filteredFiles.length > 0 ? (
                  filteredFiles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((file) => (
                      <TableRow key={file.id} hover>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{file.createdAt}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleEdit(file.id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDownload(file.downloadUrl, file.name)}
                            color="secondary"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {search ? "No matching files found" : "No files uploaded yet"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFiles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
};