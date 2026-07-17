import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import { CalendarScreen } from '../screens/CalendarScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type AppTabParamList = {
  Calendar: undefined;
  Goals: undefined;
  Notes: undefined;
  Profile: undefined;
};

type AppTabsProps = {
  onPressSignOut: () => Promise<void> | void;
  isSignOutPending: boolean;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const TAB_ICON_TEXT: Record<keyof AppTabParamList, string> = {
  Calendar: 'C',
  Goals: 'G',
  Notes: 'N',
  Profile: 'P',
};

function TabIcon({ routeName, focused }: { routeName: keyof AppTabParamList; focused: boolean }) {
  return (
    <View style={[styles.iconCircle, focused ? styles.iconCircleFocused : null]}>
      <Text style={[styles.iconText, focused ? styles.iconTextFocused : null]}>{TAB_ICON_TEXT[routeName]}</Text>
    </View>
  );
}

export function AppTabs({ onPressSignOut, isSignOutPending }: AppTabsProps) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Calendar"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0E5E85',
          tabBarInactiveTintColor: '#6A8795',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={route.name as keyof AppTabParamList} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Goals" component={GoalsScreen} />
        <Tab.Screen name="Notes" component={NotesScreen} />
        <Tab.Screen name="Profile">
          {() => <ProfileScreen onPressSignOut={onPressSignOut} isSignOutPending={isSignOutPending} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FCFEFF',
    borderTopColor: '#D3E1E8',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7E6ED',
  },
  iconCircleFocused: {
    backgroundColor: '#0E5E85',
  },
  iconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#496879',
  },
  iconTextFocused: {
    color: '#F4F8FA',
  },
});