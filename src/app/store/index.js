import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/authentication/store/authSlice";
import devicesReducer from "../../features/devices/store/devicesSlice";
import dashboardReducer from "../../features/dashboard/store/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: devicesReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setUser"],
      },
    }),
});
