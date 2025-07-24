import React, { useState, useEffect } from 'react';
import { 
  listenForDeviceModels,
  listenForDevices,
  listenForDevicePayload 
} from './dataService';

const DeviceDataViewer = () => {
  const [deviceModels, setDeviceModels] = useState({});
  const [selectedModel, setSelectedModel] = useState('');
  const [devices, setDevices] = useState({});
  const [selectedDevice, setSelectedDevice] = useState('');
  const [payload, setPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load device models
  useEffect(() => {
    const unsubscribe = listenForDeviceModels(setDeviceModels);
    return () => unsubscribe();
  }, []);

  // Load devices when model is selected
  useEffect(() => {
    if (selectedModel) {
      setIsLoading(true);
      const unsubscribe = listenForDevices(selectedModel, (data) => {
        setDevices(data);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setDevices({});
      setSelectedDevice('');
    }
  }, [selectedModel]);

  // Load payload when device is selected
  useEffect(() => {
    if (selectedModel && selectedDevice) {
      setIsLoading(true);
      const unsubscribe = listenForDevicePayload(
        selectedModel, 
        selectedDevice, 
        (data) => {
          setPayload(data);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setPayload({});
    }
  }, [selectedModel, selectedDevice]);

  return (
    <div>
      <h2>Device Data Viewer</h2>
      
      {/* Device Model Selection */}
      <div>
        <label>Select Device Model: </label>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select a Device Model --</option>
          {Object.entries(deviceModels).map(([eui, model]) => (
            <option key={eui} value={eui}>
              {model.name} ({eui})
            </option>
          ))}
        </select>
      </div>

      {/* Device Selection */}
      {selectedModel && (
        <div>
          <label>Select Device: </label>
          <select 
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            disabled={isLoading || !selectedModel}
          >
            <option value="">-- Select a Device --</option>
            {Object.keys(devices).map((deviceId) => (
              <option key={deviceId} value={deviceId}>
                {deviceId}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Payload Display */}
      {selectedDevice && (
        <div>
          <h3>Decoded Payload:</h3>
          <textarea 
            readOnly
            rows="10"
            cols="50"
            value={JSON.stringify(payload, null, 2)}
            style={{ fontFamily: 'monospace' }}
          />
        </div>
      )}

      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default DeviceDataViewer;