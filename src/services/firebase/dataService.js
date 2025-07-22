import { db } from './config';
import { ref, get, child, query, orderByKey, limitToLast } from 'firebase/database';

// Get all device EUIs
export const getAllDeviceEUIs = async () => {
  console.log('Starting getAllDeviceEUIs function');
  try {
    console.log('Creating database reference for "devices" path');
    const snapshot = await get(ref(db, 'devices'));
    
    if (snapshot.exists()) {
      console.log('Snapshot exists, extracting device EUIs');
      const euis = Object.keys(snapshot.val());
      console.log(`Found ${euis.length} device EUIs`);
      return euis;
    }
    
    console.log('Snapshot does not exist or is empty');
    return [];
  } catch (error) {
    console.error("Error fetching device EUIs:", error);
    throw error;
  } finally {
    console.log('Completed getAllDeviceEUIs operation');
  }
};

// Get all device IDs for a specific dev_eui
export const getDeviceIDsByEUI = async (devEui) => {
  console.log(`Starting getDeviceIDsByEUI for EUI: ${devEui}`);
  try {
    console.log(`Creating database reference for devices/${devEui}`);
    const snapshot = await get(ref(db, `devices/${devEui}`));
    
    if (snapshot.exists()) {
      console.log(`Snapshot exists for EUI ${devEui}, extracting device IDs`);
      const deviceIds = Object.keys(snapshot.val());
      console.log(`Found ${deviceIds.length} device IDs for EUI ${devEui}`);
      return deviceIds;
    }
    
    console.log(`No devices found for EUI ${devEui}`);
    return [];
  } catch (error) {
    console.error(`Error fetching device IDs for EUI ${devEui}:`, error);
    throw error;
  } finally {
    console.log(`Completed getDeviceIDsByEUI operation for EUI ${devEui}`);
  }
};

// Get all uplink messages for a specific device
export const getDeviceData = async (devEui, deviceId, limit = 100) => {
  console.log(`Starting getDeviceData for EUI: ${devEui}, Device ID: ${deviceId} with limit ${limit}`);
  try {
    console.log(`Creating database reference for devices/${devEui}/${deviceId}/uplink_message`);
    const deviceRef = ref(db, `devices/${devEui}/${deviceId}/uplink_message`);
    console.log('Creating query with orderByKey and limitToLast');
    const queryRef = query(deviceRef, orderByKey(), limitToLast(limit));
    
    console.log('Executing query');
    const snapshot = await get(queryRef);
    
    if (snapshot.exists()) {
      console.log(`Retrieved ${Object.keys(snapshot.val()).length} messages for device ${deviceId}`);
      return snapshot.val();
    }
    
    console.log(`No data found for device ${deviceId}`);
    return null;
  } catch (error) {
    console.error(`Error fetching data for device ${deviceId}:`, error);
    throw error;
  } finally {
    console.log(`Completed getDeviceData operation for device ${deviceId}`);
  }
};

// Get latest data for all devices (summary)
export const getAllDevicesSummary = async () => {
  console.log('Starting getAllDevicesSummary function');
  try {
    console.log('Creating database reference for "devices" path');
    const snapshot = await get(ref(db, 'devices'));
    
    if (snapshot.exists()) {
      console.log('Snapshot exists, processing devices data');
      const allDevices = snapshot.val();
      const summary = {};
      const euiCount = Object.keys(allDevices).length;
      
      console.log(`Found ${euiCount} device EUIs to process`);
      
      for (const devEui in allDevices) {
        console.log(`Processing EUI: ${devEui}`);
        const devices = allDevices[devEui];
        summary[devEui] = {};
        const deviceCount = Object.keys(devices).length;
        
        console.log(`Found ${deviceCount} devices for EUI ${devEui}`);
        
        for (const deviceId in devices) {
          console.log(`Processing device ID: ${deviceId}`);
          const deviceData = devices[deviceId];
          
          if (deviceData.uplink_message && deviceData.uplink_message.decoded_payload) {
            console.log(`Found valid uplink message for device ${deviceId}`);
            summary[devEui][deviceId] = {
              lastUpdate: deviceData.metadata?.receivedAt || 'unknown',
              payload: deviceData.uplink_message.decoded_payload
            };
          } else {
            console.log(`No valid uplink message found for device ${deviceId}`);
          }
        }
      }
      
      console.log('Completed processing all devices');
      return summary;
    }
    
    console.log('No devices found in database');
    return {};
  } catch (error) {
    console.error("Error fetching devices summary:", error);
    throw error;
  } finally {
    console.log('Completed getAllDevicesSummary operation');
  }
};