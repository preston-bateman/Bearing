import { Auth, getAuth } from 'firebase/auth';

import { getFirebaseApp } from './firebaseApp';

let cachedAuth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (cachedAuth) {
    return cachedAuth;
  }

  const firebaseApp = getFirebaseApp();

  try {
    cachedAuth = getAuth(firebaseApp);
    return cachedAuth;
  } catch (error) {
    throw new Error('Failed to initialize Firebase auth.', {
      cause: error,
    });
  }
}
