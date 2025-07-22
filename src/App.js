import { Routes, Route, Navigate } from 'react-router-dom';
import DeviceDashboard from './services/firebase/dd';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirect root to /devices */}
        <Route path="/" element={<Navigate to="/devices" replace />} />
        <Route path="/devices" element={<DeviceDashboard />} />
      </Routes>
    </div>
  );
}

export default App;