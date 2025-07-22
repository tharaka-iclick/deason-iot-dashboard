import React, { useEffect, useState } from 'react';
import { getAllDeviceEUIs, getDeviceIDsByEUI, getDeviceData } from './dataService';

function DeviceDashboard() {
  const [deviceEUIs, setDeviceEUIs] = useState([]);
  const [selectedEUI, setSelectedEUI] = useState(null);
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState(null);

  // Load all device EUIs on component mount
  useEffect(() => {
    const loadEUIs = async () => {
      try {
        const euis = await getAllDeviceEUIs();
        setDeviceEUIs(euis);
      } catch (error) {
        console.error("Failed to load EUIs:", error);
      }
    };
    loadEUIs();
  }, []);

  // Load device IDs when EUI is selected
  useEffect(() => {
    if (selectedEUI) {
      const loadDeviceIDs = async () => {
        try {
          const ids = await getDeviceIDsByEUI(selectedEUI);
          setDeviceIDs(ids);
        } catch (error) {
          console.error("Failed to load device IDs:", error);
        }
      };
      loadDeviceIDs();
    }
  }, [selectedEUI]);

  // Load device data when device is selected
  useEffect(() => {
    if (selectedEUI && selectedDevice) {
      const loadData = async () => {
        try {
          const data = await getDeviceData(selectedEUI, selectedDevice);
          setDeviceData(data);
        } catch (error) {
          console.error("Failed to load device data:", error);
        }
      };
      loadData();
    }
  }, [selectedEUI, selectedDevice]);

  return (
    <div>
      <h2>Device Dashboard</h2>
      
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
          <h3>Device Data</h3>
          <pre>{JSON.stringify(deviceData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DeviceDashboard;