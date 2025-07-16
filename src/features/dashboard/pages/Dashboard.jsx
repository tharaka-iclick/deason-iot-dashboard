import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Thermometer, Droplets, Zap } from "lucide-react";
import { Card } from "../../../shared/components/ui/Card";
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // reset to first page on search
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = sampleData.filter(
    (row) =>
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.customerName.toLowerCase().includes(search.toLowerCase())
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
              <Button variant="contained" startIcon={<AddIcon />}>
                Add
              </Button>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created Time</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.createdTime}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => alert(`Edit ${row.id}`)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => alert(`Download ${row.id}`)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No records found
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
