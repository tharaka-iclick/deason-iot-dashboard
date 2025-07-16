import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase/config";
import { setUser, setLoading } from "./features/authentication/store/authSlice";
import { Login } from "./features/authentication/pages/Login";
import { Dashboard } from "./features/dashboard/pages/Dashboard";
import { DeviceManagement } from "./features/devices/pages/DeviceManagement";
import { Profile } from "./features/profile/pages/Profile";
import { Layout } from "./shared/components/layout/Layout";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { Spinner } from "./shared/components/ui/Spinner";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
          })
        );
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="devices" element={<DeviceManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
