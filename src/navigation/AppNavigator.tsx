import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppTheme } from '../contexts/ThemeContext';
import { AlertsScreen } from '../screens/AlertsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { MonitoringScreen } from '../screens/MonitoringScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  const { theme } = useAppTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        }}
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
    </NavigationContainer>
  );
}