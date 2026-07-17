import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTabs } from './src/navigation/AppTabs';
import { useAuthBootstrap } from './src/features/auth/useAuthBootstrap';
import { signInWithAnonymousAuth, signOutCurrentUser } from './src/services/firebase/firebaseAuthActions';
import { colors, componentTokens, layout, spacing, typography } from './src/design/tokens';

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

  if (showSignedIn) {
    return (
      <View style={styles.authenticatedContainer}>
        {authActionError ? (
          <View style={styles.authErrorBanner}>
            <Text style={styles.errorTitle}>Auth action error</Text>
            <Text style={styles.errorText}>{authActionError}</Text>
          </View>
        ) : null}
        <View style={styles.tabsContainer}>
          <AppTabs onPressSignOut={onPressSignOut} isSignOutPending={isAuthActionPending} />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bearing</Text>

      {showLoading ? <Text style={styles.body}>Checking session...</Text> : null}
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
  authenticatedContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flex: 1,
  },
  authErrorBanner: {
    paddingHorizontal: layout.pagePaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.dangerSurface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: layout.pagePaddingHorizontal,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  block: {
    width: '100%',
    gap: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textPrimary,
  },
  helper: {
    ...typography.helper,
    color: colors.textSecondary,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: componentTokens.button.borderRadius,
    paddingHorizontal: componentTokens.button.paddingHorizontal,
    paddingVertical: componentTokens.button.paddingVertical,
    backgroundColor: componentTokens.button.backgroundColor,
  },
  buttonText: {
    color: componentTokens.button.textColor,
    ...typography.button,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dangerText,
  },
  errorText: {
    fontSize: 14,
    color: colors.dangerText,
  },
});
