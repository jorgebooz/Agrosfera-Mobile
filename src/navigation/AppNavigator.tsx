import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../contexts/ThemeContext';
import { AlertsScreen } from '../screens/AlertsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { MonitoringScreen } from '../screens/MonitoringScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootStackParamList, RootTabParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconName =
  | 'grid-outline'
  | 'grid'
  | 'analytics-outline'
  | 'analytics'
  | 'warning-outline'
  | 'warning'
  | 'time-outline'
  | 'time'
  | 'settings-outline'
  | 'settings';

function getTabIconName(
  routeName: keyof RootTabParamList,
  focused: boolean
): TabIconName {
  switch (routeName) {
    case 'Dashboard':
      return focused ? 'grid' : 'grid-outline';
    case 'Monitoring':
      return focused ? 'analytics' : 'analytics-outline';
    case 'Alerts':
      return focused ? 'warning' : 'warning-outline';
    case 'History':
      return focused ? 'time' : 'time-outline';
    case 'Settings':
      return focused ? 'settings' : 'settings-outline';
    default:
      return focused ? 'grid' : 'grid-outline';
  }
}

function MainTabs() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIconName(
            route.name as keyof RootTabParamList,
            focused
          );

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />

      <Tab.Screen
        name="Monitoring"
        component={MonitoringScreen}
        options={{ title: 'Monitoramento' }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ title: 'Alertas' }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico' }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { theme } = useAppTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}