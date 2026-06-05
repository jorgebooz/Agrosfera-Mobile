import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CultivationAnalytics } from '../components/CultivationAnalytics';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { FadeInView } from '../components/FadeInView';
import { SensorStatusChart } from '../components/SensorStatusChart';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { generateSimulatedSensors } from '../services/sensorService';
import { AppTheme } from '../theme';
import { SensorData, SensorStatus } from '../types/sensor';
import { getStatusLabel } from '../utils/status';

export function DashboardScreen() {
  const { theme } = useAppTheme();

  const [sensors, setSensors] = useState<SensorData[]>([]);

  const isLoading = useScreenLoading();
  const styles = createStyles(theme);

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

  function getStatusDescription(status: SensorStatus): string {
    switch (status) {
      case 'ideal':
        return 'O cultivo está operando dentro dos parâmetros esperados.';
      case 'attention':
        return 'Há pontos que precisam de acompanhamento preventivo.';
      case 'critical':
        return 'Existem indicadores críticos que exigem atenção imediata.';
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Agrosfera Analytics</Text>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>
        Análise visual dos sensores e indicadores calculados do cultivo.
      </Text>

      <FadeInView delay={80}>
        <View style={[styles.statusCard, getStatusCardStyle(summary.generalStatus)]}>
          <Text style={styles.statusLabel}>Status geral</Text>
          <Text style={styles.statusTitle}>
            {getStatusLabel(summary.generalStatus)}
          </Text>
          <Text style={styles.statusDescription}>
            {getStatusDescription(summary.generalStatus)}
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={160}>
        <CultivationAnalytics sensors={sensors} />
      </FadeInView>

      <FadeInView delay={240}>
        <SensorStatusChart
          ideal={summary.ideal}
          attention={summary.attention}
          critical={summary.critical}
        />
      </FadeInView>
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
  });
}