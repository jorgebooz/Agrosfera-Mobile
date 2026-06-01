import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoadingScreen } from '../components/LoadingScreen';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { generateSimulatedSensors } from '../services/sensorService';
import { lightTheme } from '../theme';
import { SensorData, SensorStatus } from '../types/sensor';
import { getStatusLabel } from '../utils/status';

export function DashboardScreen() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const isLoading = useScreenLoading();

  useEffect(() => {
    setSensors(generateSimulatedSensors());

    const interval = setInterval(() => {
      setSensors(generateSimulatedSensors());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const summary = useMemo(() => {
    const total = sensors.length;
    const ideal = sensors.filter((sensor) => sensor.status === 'ideal').length;
    const attention = sensors.filter((sensor) => sensor.status === 'attention').length;
    const critical = sensors.filter((sensor) => sensor.status === 'critical').length;

    let generalStatus: SensorStatus = 'ideal';

    if (critical > 0) {
      generalStatus = 'critical';
    } else if (attention > 0) {
      generalStatus = 'attention';
    }

    return {
      total,
      ideal,
      attention,
      critical,
      generalStatus,
    };
  }, [sensors]);

  const mainSensors = useMemo(() => {
    return sensors.slice(0, 3);
  }, [sensors]);

  if (isLoading) {
    return <LoadingScreen message="Carregando dashboard do cultivo..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Agrosfera Mobile</Text>
      <Text style={styles.title}>Dashboard do cultivo</Text>
      <Text style={styles.subtitle}>
        Monitoramento inteligente para ambientes de cultivo controlado.
      </Text>

      <View style={[styles.statusCard, getStatusCardStyle(summary.generalStatus)]}>
        <Text style={styles.statusLabel}>Status geral</Text>
        <Text style={styles.statusTitle}>{getStatusLabel(summary.generalStatus)}</Text>
        <Text style={styles.statusDescription}>
          {getStatusDescription(summary.generalStatus)}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{summary.total}</Text>
          <Text style={styles.metricLabel}>Sensores ativos</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{summary.ideal}</Text>
          <Text style={styles.metricLabel}>Em estado ideal</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{summary.attention}</Text>
          <Text style={styles.metricLabel}>Em atenção</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{summary.critical}</Text>
          <Text style={styles.metricLabel}>Críticos</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores principais</Text>

        {mainSensors.map((sensor) => (
          <View key={sensor.id} style={styles.sensorRow}>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <Text style={styles.sensorDescription}>{sensor.description}</Text>
            </View>

            <View style={styles.sensorValueWrapper}>
              <Text style={styles.sensorValue}>
                {sensor.value}
                {sensor.unit}
              </Text>
              <Text style={[styles.sensorStatus, getStatusTextStyle(sensor.status)]}>
                {getStatusLabel(sensor.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.spaceCard}>
        <Text style={styles.spaceTitle}>Conexão espacial</Text>
        <Text style={styles.spaceText}>
          O Agrosfera aplica a lógica de ambientes extremos, como bases lunares e
          habitats remotos, para tornar o cultivo na Terra mais eficiente,
          sustentável e monitorado por dados.
        </Text>
      </View>
    </ScrollView>
  );
}

const theme = lightTheme;

function getStatusDescription(status: SensorStatus): string {
  switch (status) {
    case 'ideal':
      return 'Todos os principais parâmetros estão dentro da faixa esperada.';
    case 'attention':
      return 'Alguns sensores precisam de acompanhamento preventivo.';
    case 'critical':
      return 'Há indicadores fora da faixa segura. Verifique os alertas.';
    default:
      return 'Status indisponível.';
  }
}

function getStatusCardStyle(status: SensorStatus) {
  switch (status) {
    case 'ideal':
      return { borderLeftColor: theme.colors.success };
    case 'attention':
      return { borderLeftColor: theme.colors.warning };
    case 'critical':
      return { borderLeftColor: theme.colors.danger };
    default:
      return { borderLeftColor: theme.colors.border };
  }
}

function getStatusTextStyle(status: SensorStatus) {
  switch (status) {
    case 'ideal':
      return { color: theme.colors.success };
    case 'attention':
      return { color: theme.colors.warning };
    case 'critical':
      return { color: theme.colors.danger };
    default:
      return { color: theme.colors.textMuted };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 6,
    marginBottom: theme.spacing.lg,
  },
  statusLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: theme.spacing.xs,
  },
  statusTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  statusDescription: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricValue: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 18,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },
  sensorRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  sensorDescription: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  sensorValueWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sensorValue: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  sensorStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  spaceCard: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  spaceTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  spaceText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
});