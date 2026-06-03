import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../theme';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({
  message = 'Carregando dados...',
}: LoadingScreenProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    message: {
      marginTop: theme.spacing.md,
      color: theme.colors.textMuted,
      fontSize: 16,
      textAlign: 'center',
    },
  });
}