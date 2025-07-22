import { db } from './config';
import { ref, onValue, off } from 'firebase/database';

// Real-time listener for all device EUIs
export const listenForDeviceEUIs = (callback) => {
  const euiRef = ref(db, 'devices');
  const listener = onValue(euiRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.keys(data) : []);
  });
  
  // Return unsubscribe function
  return () => off(euiRef, listener);
};

// Real-time listener for device IDs under a specific EUI
export const listenForDeviceIDs = (devEui, callback) => {
  const deviceRef = ref(db, `devices/${devEui}`);
  const listener = onValue(deviceRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.keys(data) : []);
  });
  
  return () => off(deviceRef, listener);
};

// Real-time listener for a specific device's data
export const listenForDeviceData = (devEui, deviceId, callback) => {
  const dataRef = ref(db, `devices/${devEui}/${deviceId}/uplink_message`);
  const listener = onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
  
  return () => off(dataRef, listener);
};