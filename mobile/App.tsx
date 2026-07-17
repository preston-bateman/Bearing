import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthBootstrap } from './src/features/auth/useAuthBootstrap';
import { signInWithAnonymousAuth, signOutCurrentUser } from './src/services/firebase/firebaseAuthActions';

export default function App() {
  const { status, user, error } = useAuthBootstrap();
  const [authActionError, setAuthActionError] = useState<string | null>(null);
  const [isAuthActionPending, setIsAuthActionPending] = useState(false);

  const showSignedIn = status === 'authenticated' && user;
  const showSignedOut = status === 'unauthenticated';
  const showLoading = status === 'loading';
  const showError = status === 'error';

  const onPressSignInEntry = async (): Promise<void> => {
    setAuthActionError(null);
    setIsAuthActionPending(true);

    try {
      await signInWithAnonymousAuth();
    } catch (actionError) {
      setAuthActionError(actionError instanceof Error ? actionError.message : 'Sign-in failed.');
    } finally {
      setIsAuthActionPending(false);
    }
  };

  const onPressSignOut = async (): Promise<void> => {
    setAuthActionError(null);
    setIsAuthActionPending(true);

    try {
      await signOutCurrentUser();
    } catch (actionError) {
      setAuthActionError(actionError instanceof Error ? actionError.message : 'Sign-out failed.');
    } finally {
      setIsAuthActionPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bearing</Text>

      {showLoading ? <Text style={styles.body}>Checking session...</Text> : null}

      {showSignedIn ? (
        <View style={styles.block}>
          <Text style={styles.body}>Session detected.</Text>
          <Text style={styles.body}>UID: {user.uid}</Text>
          <Text style={styles.helper}>Authenticated users will be routed to app tabs in M1.4.</Text>
          <Pressable onPress={onPressSignOut} style={[styles.button, isAuthActionPending ? styles.buttonDisabled : null]} disabled={isAuthActionPending}>
            <Text style={styles.buttonText}>{isAuthActionPending ? 'Working...' : 'Sign Out'}</Text>
          </Pressable>
        </View>
      ) : null}

      {showSignedOut ? (
        <View style={styles.block}>
          <Text style={styles.body}>No active session found.</Text>
          <Pressable onPress={onPressSignInEntry} style={[styles.button, isAuthActionPending ? styles.buttonDisabled : null]} disabled={isAuthActionPending}>
            <Text style={styles.buttonText}>{isAuthActionPending ? 'Working...' : 'Open Sign-In Entry'}</Text>
          </Pressable>
          <Text style={styles.helper}>Open Sign-In Entry uses anonymous auth for M1.2 validation.</Text>
        </View>
      ) : null}

      {authActionError ? (
        <View style={styles.block}>
          <Text style={styles.errorTitle}>Auth action error</Text>
          <Text style={styles.errorText}>{authActionError}</Text>
        </View>
      ) : null}

      {showError ? (
        <View style={styles.block}>
          <Text style={styles.errorTitle}>Startup error</Text>
          <Text style={styles.errorText}>{error?.message ?? 'Unknown startup error.'}</Text>
        </View>
      ) : null}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FA',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  block: {
    width: '100%',
    gap: 8,
  },
  body: {
    fontSize: 16,
    color: '#153748',
  },
  helper: {
    fontSize: 14,
    color: '#496879',
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0E5E85',
  },
  buttonText: {
    color: '#F4F8FA',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8A1E1E',
  },
  errorText: {
    fontSize: 14,
    color: '#8A1E1E',
  },
});
