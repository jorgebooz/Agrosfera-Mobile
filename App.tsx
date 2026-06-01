import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { lightTheme } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agrosfera Mobile</Text>
      <Text style={styles.subtitle}>
        Monitoramento inteligente para cultivo sustentável
      </Text>

      <StatusBar style="dark" />
    </View>
  );
}

const theme = lightTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
});