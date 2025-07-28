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
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Convert snake_case to Title Case
  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
          setSelectedValue('');
        }
      );
      return () => unsubscribe();
    } else {
      setPayload({});
    }
  }, [selectedModel, selectedDevice]);

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };

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

      {/* Payload Radio Buttons */}
      {selectedDevice && Object.keys(payload).length > 0 && (
        <div>
          <h3>Select a Value:</h3>
          {Object.entries(payload).map(([key, value]) => {
            const displayText = `${formatKey(key)}: ${value}`;
            return (
              <div key={key}>
                <input
                  type="radio"
                  id={key}
                  name="payloadValue"
                  value={displayText}
                  checked={selectedValue === displayText}
                  onChange={handleRadioChange}
                />
                <label htmlFor={key}>
                  {displayText}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Value Display */}
      {selectedValue && (
        <div>
          <h3>Selected Value:</h3>
          <input
            type="text"
            value={selectedValue}
            readOnly
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
      )}

      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default DeviceDataViewer;