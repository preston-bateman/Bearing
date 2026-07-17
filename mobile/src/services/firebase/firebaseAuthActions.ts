import { signInAnonymously, signOut } from 'firebase/auth';

import { getFirebaseAuth } from './firebaseAuth';

export async function signInWithAnonymousAuth(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await signInAnonymously(auth);
  } catch (error) {
    throw new Error('Failed to sign in anonymously.', {
      cause: error,
    });
  }
}

export async function signOutCurrentUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to sign out current user.', {
      cause: error,
    });
  }
}
