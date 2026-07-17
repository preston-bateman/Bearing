import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { getFirebaseRuntimeConfig } from '../config/firebaseEnv';

let cachedFirebaseApp: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (cachedFirebaseApp) {
    return cachedFirebaseApp;
  }

  try {
    const config = getFirebaseRuntimeConfig();
    cachedFirebaseApp = getApps().length > 0 ? getApp() : initializeApp(config);
    return cachedFirebaseApp;
  } catch (error) {
    throw new Error('Failed to initialize Firebase app.', {
      cause: error,
    });
  }
}
