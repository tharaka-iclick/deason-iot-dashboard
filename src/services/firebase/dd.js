import React, { useEffect, useState } from 'react';
import { 
  listenForDeviceEUIs, 
  listenForDeviceIDs, 
  listenForDeviceData 
} from './dataService';

function DeviceDashboard() {
  const [deviceEUIs, setDeviceEUIs] = useState([]);
  const [selectedEUI, setSelectedEUI] = useState(null);
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState(null);

  // Listen for EUIs
  useEffect(() => {
    const unsubscribe = listenForDeviceEUIs((euis) => {
      setDeviceEUIs(euis);
    });
    return () => unsubscribe();
  }, []);

  // Listen for device IDs when EUI is selected
  useEffect(() => {
    if (selectedEUI) {
      const unsubscribe = listenForDeviceIDs(selectedEUI, (ids) => {
        setDeviceIDs(ids);
      });
      return () => unsubscribe();
    }
  }, [selectedEUI]);

  // Listen for device data when device is selected
  useEffect(() => {
    if (selectedEUI && selectedDevice) {
      const unsubscribe = listenForDeviceData(
        selectedEUI, 
        selectedDevice, 
        (data) => {
          setDeviceData(data);
        }
      );
      return () => unsubscribe();
    }
  }, [selectedEUI, selectedDevice]);

  return (
    <div>
      <h2>Real-Time Device Dashboard</h2>
      
      <div>
        <label>Select Device EUI:</label>
        <select 
          value={selectedEUI || ''} 
          onChange={(e) => setSelectedEUI(e.target.value)}
        >
          <option value="">Select EUI</option>
          {deviceEUIs.map(eui => (
            <option key={eui} value={eui}>{eui}</option>
          ))}
        </select>
      </div>

      {selectedEUI && (
        <div>
          <label>Select Device ID:</label>
          <select 
            value={selectedDevice || ''} 
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="">Select Device</option>
            {deviceIDs.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {deviceData && (
        <div>
          <h3>Device Data (Live Updates)</h3>
          <pre>{JSON.stringify(deviceData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DeviceDashboard;