import { ListItem } from '../components/ui/ListItem';
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
      <ListItem
        onPress={onPressSignOut}
        title="Sign Out"
        description="Sign out remains available here while profile features are still placeholders."
        trailingText={isSignOutPending ? 'Working...' : 'Action'}
        disabled={isSignOutPending}
      />
    </TabPlaceholderScreen>
  );
}
