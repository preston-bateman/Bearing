import { Pressable, StyleSheet, Text } from 'react-native';

import { TabPlaceholderScreen } from './TabPlaceholderScreen';

type ProfileScreenProps = {
  onPressSignOut: () => Promise<void> | void;
  isSignOutPending: boolean;
};

export function ProfileScreen({ onPressSignOut, isSignOutPending }: ProfileScreenProps) {
  return (
    <TabPlaceholderScreen
      title="Profile"
      description="Manage account settings, premium access, and future calendar connections."
      routeId="tabs/profile"
    >
      <Pressable
        onPress={onPressSignOut}
        style={[styles.button, isSignOutPending ? styles.buttonDisabled : null]}
        disabled={isSignOutPending}
      >
        <Text style={styles.buttonText}>{isSignOutPending ? 'Working...' : 'Sign Out'}</Text>
      </Pressable>
      <Text style={styles.helper}>Sign out remains available here while profile features are still placeholders.</Text>
    </TabPlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0E5E85',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#F4F8FA',
    fontWeight: '600',
  },
  helper: {
    fontSize: 14,
    color: '#496879',
  },
});