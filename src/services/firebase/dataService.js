import { db } from './config';
import { ref, onValue, off, query,get, } from 'firebase/database';
import { firestore } from './config';
import { collection, addDoc, updateDoc, doc, getDocs, query as firestoreQuery, where, orderBy } from 'firebase/firestore';

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

export const listenForFarms = (callback) => {
  const farmsRef = ref(db, 'farms');
  const listener = onValue(farmsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return () => off(farmsRef, listener);
};

export const getFarms = async () => {
  const farmsRef = ref(db, 'farms');
  const snapshot = await get(farmsRef);
  return snapshot.val() || {};
};

export const saveDashboardToFirestore = async (dashboardData) => {
  try {
    const dashboardsRef = collection(firestore, 'dashboards');
    const docRef = await addDoc(dashboardsRef, {
      ...dashboardData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Dashboard saved to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving dashboard to Firestore:', error);
    throw error;
  }
};

export const updateDashboardInFirestore = async (dashboardId, dashboardData) => {
  try {
    const dashboardRef = doc(firestore, 'dashboards', dashboardId);
    await updateDoc(dashboardRef, {
      ...dashboardData,
      updatedAt: new Date()
    });
    
    console.log('Dashboard updated in Firestore with ID:', dashboardId);
    return dashboardId;
  } catch (error) {
    console.error('Error updating dashboard in Firestore:', error);
    throw error;
  }
};

export const getDashboardsFromFirestore = async (userId = null, farmId = null) => {
  try {
    const dashboardsRef = collection(firestore, 'dashboards');
    let q = firestoreQuery(dashboardsRef, orderBy('createdAt', 'desc'));
    console.log('userId', userId);
    if (userId) {
      q = firestoreQuery(dashboardsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    }
    
    if (farmId) {
      q = firestoreQuery(dashboardsRef, where('farmId', '==', farmId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const dashboards = [];
    
    querySnapshot.forEach((doc) => {
      dashboards.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return dashboards;
  } catch (error) {
    console.error('Error getting dashboards from Firestore:', error);
    throw error;
  }
};
