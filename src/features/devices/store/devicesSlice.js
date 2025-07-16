import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../services/firebase/config";

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (userId, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/devices`)
      );
      const devices = [];
      querySnapshot.forEach((doc) => {
        devices.push({ id: doc.id, ...doc.data() });
      });
      return devices;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDevice = createAsyncThunk(
  "devices/addDevice",
  async ({ userId, device }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/devices`), {
        ...device,
        createdAt: new Date(),
        status: "offline",
      });
      return { id: docRef.id, ...device, status: "offline" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateDeviceStatus: (state, action) => {
      const { deviceId, status } = action.payload;
      const device = state.devices.find((d) => d.id === deviceId);
      if (device) {
        device.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      });
  },
});

export const { updateDeviceStatus } = devicesSlice.actions;
export default devicesSlice.reducer;
