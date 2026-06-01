import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { generateSimulatedSensors } from '../services/sensorService';
import { lightTheme } from '../theme';
import { SensorData, SensorStatus } from '../types/sensor';
import { getStatusLabel } from '../utils/status';

import { LoadingScreen } from '../components/LoadingScreen';
import { useScreenLoading } from '../hooks/useScreenLoading';

export function MonitoringScreen() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const isLoading = useScreenLoading();

  useEffect(() => {
    setSensors(generateSimulatedSensors());

    const interval = setInterval(() => {
      setSensors(generateSimulatedSensors());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Atualizando sensores do cultivo..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramento</Text>
      <Text style={styles.subtitle}>
        Sensores simulados atualizados automaticamente.
      </Text>

      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sensorName}>{item.name}</Text>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
              </View>
            </View>

            <Text style={styles.sensorValue}>
              {item.value}
              {item.unit}
            </Text>

            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const theme = lightTheme;

function getStatusStyle(status: SensorStatus) {
  switch (status) {
    case 'ideal':
      return { backgroundColor: theme.colors.success };
    case 'attention':
      return { backgroundColor: theme.colors.warning };
    case 'critical':
      return { backgroundColor: theme.colors.danger };
    default:
      return { backgroundColor: theme.colors.border };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sensorName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sensorValue: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});