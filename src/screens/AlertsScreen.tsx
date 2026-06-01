import { StyleSheet, Text, View } from 'react-native';
import { lightTheme } from '../theme';

export function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      <Text style={styles.subtitle}>Riscos e recomendações do cultivo.</Text>
    </View>
  );
}

const theme = lightTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
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
  },
});