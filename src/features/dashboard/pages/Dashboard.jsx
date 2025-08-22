import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Activity, Thermometer, Droplets, Zap } from "lucide-react";
import { updateMetrics, updateSensorData } from "../store/dashboardSlice";
import { getDashboardsFromFirestore } from "../../../services/firebase/dataService";
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
import { useNavigate, useLocation } from "react-router-dom";

// import "./Dashboard.css";

const sampleData = [
  {
    id: 1,
    createdTime: "2025-06-01",
    title: "Report A",
    customerName: "John Doe",
  },
  {
    id: 2,
    createdTime: "2025-06-02",
    title: "Report B",
    customerName: "Jane Smith",
  },
  {
    id: 3,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },
  {
    id: 4,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },
  {
    id: 5,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },
  {
    id: 6,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },
  {
    id: 7,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },
  {
    id: 8,
    createdTime: "2025-06-03",
    title: "Report C",
    customerName: "Alice Johnson",
  },

  // Add more mock data as needed
];

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  const { metrics, sensorData } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [savedDashboards, setSavedDashboards] = useState([]);
  const [dashboardsLoading, setDashboardsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // reset to first page on search
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };



  const filteredRows = savedDashboards.filter(
    (dashboard) =>
      dashboard.title?.toLowerCase().includes(search.toLowerCase()) ||
      dashboard.farmId?.toLowerCase().includes(search.toLowerCase()) ||
      dashboard.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Calculate metrics from devices
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

    // Generate mock sensor data
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      power: 50 + Math.random() * 30,
    }));

    dispatch(updateSensorData(mockData));
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  }, [devices, dispatch]);

  useEffect(() => {
    if (user?.uid) {
      fetchSavedDashboards();
    }
  }, [user?.uid]);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.showSuccess && location.state?.savedDashboard) {
      const dashboard = location.state.savedDashboard;
      const isUpdate = location.state.isUpdate;
      const successMessage = isUpdate 
        ? `Dashboard "${dashboard.title}" updated successfully!`
        : `Dashboard "${dashboard.title}" saved successfully!`;
      
      setSaveSuccess(successMessage);
      // Refresh the dashboard list
      fetchSavedDashboards();
      // Clear success message after 5 seconds
      setTimeout(() => setSaveSuccess(""), 5000);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

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
    navigate("/dashboard/edit"); // your route
  };

  const fetchSavedDashboards = async () => {
    try {
      setDashboardsLoading(true);
      const dashboards = await getDashboardsFromFirestore(user?.uid);
      setSavedDashboards(dashboards);
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      setError('Failed to load saved dashboards');
    } finally {
      setDashboardsLoading(false);
    }
  };

  const handleDashboardSaved = (dashboardData) => {
    if (dashboardData.firestoreId) {
      setSaveSuccess(`Dashboard "${dashboardData.title}" saved successfully!`);
      // Refresh the dashboard list
      fetchSavedDashboards();
      // Clear success message after 5 seconds
      setTimeout(() => setSaveSuccess(""), 5000);
    }
  };

  return (
    <div className="dashboard">
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        {saveSuccess && <Alert severity="success">{saveSuccess}</Alert>}
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
                label="Search dashboards"
                variant="outlined"
                size="small"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by title, farm, or description..."
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={fetchSavedDashboards}
                  disabled={dashboardsLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                >
                  Add Dashboard
                </Button>
              </Stack>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created Time</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Farm</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dashboardsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                          <CircularProgress size={20} />
                          Loading dashboards...
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dashboard) => (
                      <TableRow key={dashboard.id}>
                        <TableCell>
                          {dashboard.createdAt ? 
                            new Date(dashboard.createdAt.toDate ? dashboard.createdAt.toDate() : dashboard.createdAt).toLocaleDateString() 
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{dashboard.title || 'Untitled'}</TableCell>
                        <TableCell>{dashboard.farmName || 'N/A'}</TableCell>
                        <TableCell>
                          {dashboard.description ? 
                            (dashboard.description.length > 50 ? 
                              `${dashboard.description.substring(0, 50)}...` : 
                              dashboard.description
                            ) : 'No description'
                          }
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            onClick={() => navigate(`/dashboard/edit?id=${dashboard.id}`)}
                            title="Edit Dashboard"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => window.open(dashboard.filepath, '_blank')}
                            title="Open Dashboard"
                            disabled={!dashboard.filepath}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!dashboardsLoading && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No dashboards found
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
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        )}
      </Box>

      {/* <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <Card key={index} className={`metric-card metric-${metric.color}`}>
            <div className="metric-icon">
              <metric.icon size={24} />
            </div>
            <div className="metric-content">
              <h3>{metric.value}</h3>
              <p>{metric.label}</p>
            </div>
          </Card>
        ))}
      </div> */}

      {/* <div className="charts-grid">
        <Card className="chart-card">
          <h3>Temperature & Humidity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#82ca9d"
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card">
          <h3>Power Consumption</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#ffc658"
                name="Power (W)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div> */}
    </div>
  );
};
