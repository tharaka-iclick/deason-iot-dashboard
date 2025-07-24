import { db } from './config';
import { ref, onValue, off, query } from 'firebase/database';

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


export const listenForDevicePayload = (devEui, deviceId, callback) => {
  const payloadRef = query(ref(db, `devices/${devEui}/${deviceId}/uplink_message/decoded_payload`));
  const listener = onValue(payloadRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(payloadRef, listener);
};