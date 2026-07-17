import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { getFirebaseAuth } from '../../services/firebase/firebaseAuth';

export type AuthBootstrapStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type AuthBootstrapState = {
  status: AuthBootstrapStatus;
  user: User | null;
  error: Error | null;
};

export function useAuthBootstrap(): AuthBootstrapState {
  const [state, setState] = useState<AuthBootstrapState>({
    status: 'loading',
    user: null,
    error: null,
  });

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();

      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setState({
            status: user ? 'authenticated' : 'unauthenticated',
            user,
            error: null,
          });
        },
        (error) => {
          setState({
            status: 'error',
            user: null,
            error,
          });
        },
      );

      return unsubscribe;
    } catch (error) {
      setState({
        status: 'error',
        user: null,
        error: error instanceof Error ? error : new Error('Unknown auth bootstrap error.'),
      });

      return () => {};
    }
  }, []);

  return state;
}
