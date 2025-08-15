import { db } from './config';
import { ref, onValue, off, query,get, } from 'firebase/database';

export const listenForDeviceModels = (callback) => {
  const modelsRef = ref(db, 'device_models');
  const listener = onValue(modelsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(modelsRef, listener);
};


export const listenForDevices = (devEui, callback) => {
  const devicesRef = ref(db, `devices/${devEui}`);
  const listener = onValue(devicesRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(devicesRef, listener);
};


export const getDeviceModels = async () => {
  const modelsRef = ref(db, 'device_models');
  const snapshot = await get(modelsRef);
  return snapshot.val() || {};
};

export const getDevice = async (devEui) => {
  const deviceRef = ref(db, `devices/${devEui}`);
  const snapshot = await get(deviceRef);
  return snapshot.val() || {};
};

export const listenForDevicePayload = (devEui, deviceId, callback) => {
  const payloadRef = query(ref(db, `devices/${devEui}/${deviceId}/uplink_message/decoded_payload`));
  const listener = onValue(payloadRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(payloadRef, listener);
};
export const getDevicePayload = async (devEui, deviceId) => {
  const payloadRef = query(ref(db, `devices/${devEui}/${deviceId}/uplink_message/decoded_payload`));
  const snapshot = await get(payloadRef);
  return snapshot.val() || {};
};

export const listenForSensoreData = (devEui, deviceId,senseorData, callback) => {
  const payloadRef = query(ref(db, `devices/${devEui}/${deviceId}/uplink_message/decoded_payload/${senseorData}`));
  const listener = onValue(payloadRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(payloadRef, listener);
};

export const saveDashboardToStorage = async (diagramData, filename) => {

}
