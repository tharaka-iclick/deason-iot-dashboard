import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    metrics: {
      totalDevices: 0,
      activeDevices: 0,
      offlineDevices: 0,
      alerts: 0,
    },
    sensorData: [],
  },
  reducers: {
    updateMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    updateSensorData: (state, action) => {
      state.sensorData = action.payload;
    },
  },
});

export const { updateMetrics, updateSensorData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
