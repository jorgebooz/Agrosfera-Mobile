import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../theme';
import { SensorData } from '../types/sensor';

interface CultivationAnalyticsProps {
  sensors: SensorData[];
}

export function CultivationAnalytics({ sensors }: CultivationAnalyticsProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const totalSensors = sensors.length || 1;

  const idealCount = sensors.filter((sensor) => sensor.status === 'ideal').length;
  const attentionCount = sensors.filter(
    (sensor) => sensor.status === 'attention'
  ).length;
  const criticalCount = sensors.filter(
    (sensor) => sensor.status === 'critical'
  ).length;

  const healthIndex = Math.round((idealCount / totalSensors) * 100);

  const waterSensor = sensors.find(
    (sensor) => sensor.type === 'waterConsumption'
  );

  const waterEfficiency = getWaterEfficiency(waterSensor?.value);
  const operationalRisk = getOperationalRisk(criticalCount, attentionCount);

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Dashboard analítico</Text>
      <Text style={styles.title}>Análise do cultivo</Text>
      <Text style={styles.description}>
        Indicadores calculados a partir das leituras atuais dos sensores.
      </Text>

      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsItem}>
          <Text style={styles.analyticsValue}>{healthIndex}%</Text>
          <Text style={styles.analyticsLabel}>Saúde do cultivo</Text>
          <Text style={styles.analyticsHint}>
            Baseado nos sensores em estado ideal.
          </Text>
        </View>

        <View style={styles.analyticsItem}>
          <Text
            style={[
              styles.analyticsValue,
              getRiskTextStyle(operationalRisk.level, theme),
            ]}
          >
            {operationalRisk.label}
          </Text>
          <Text style={styles.analyticsLabel}>Risco operacional</Text>
          <Text style={styles.analyticsHint}>
            Considera sensores em atenção ou críticos.
          </Text>
        </View>

        <View style={styles.analyticsItemWide}>
          <Text
            style={[
              styles.analyticsValue,
              getEfficiencyTextStyle(waterEfficiency.level, theme),
            ]}
          >
            {waterEfficiency.label}
          </Text>
          <Text style={styles.analyticsLabel}>Eficiência hídrica</Text>
          <Text style={styles.analyticsHint}>
            {waterEfficiency.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function getWaterEfficiency(value?: number) {
  if (value === undefined) {
    return {
      label: 'Indisponível',
      level: 'neutral',
      description: 'Aguardando leitura do consumo hídrico.',
    };
  }

  if (value <= 13) {
    return {
      label: 'Alta',
      level: 'good',
      description: `Consumo atual de ${value}L/h dentro da faixa eficiente.`,
    };
  }

  if (value <= 18) {
    return {
      label: 'Moderada',
      level: 'warning',
      description: `Consumo atual de ${value}L/h exige acompanhamento.`,
    };
  }

  return {
    label: 'Baixa',
    level: 'danger',
    description: `Consumo atual de ${value}L/h acima do esperado.`,
  };
}

function getOperationalRisk(criticalCount: number, attentionCount: number) {
  if (criticalCount > 0) {
    return {
      label: 'Alto',
      level: 'danger',
    };
  }

  if (attentionCount > 0) {
    return {
      label: 'Médio',
      level: 'warning',
    };
  }

  return {
    label: 'Baixo',
    level: 'good',
  };
}

function getRiskTextStyle(level: string, theme: AppTheme) {
  switch (level) {
    case 'danger':
      return { color: theme.colors.danger };
    case 'warning':
      return { color: theme.colors.warning };
    case 'good':
      return { color: theme.colors.success };
    default:
      return { color: theme.colors.primary };
  }
}

function getEfficiencyTextStyle(level: string, theme: AppTheme) {
  switch (level) {
    case 'danger':
      return { color: theme.colors.danger };
    case 'warning':
      return { color: theme.colors.warning };
    case 'good':
      return { color: theme.colors.success };
    default:
      return { color: theme.colors.primary };
  }
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    kicker: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: theme.spacing.xs,
    },
    title: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: '800',
      marginBottom: theme.spacing.sm,
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    analyticsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    analyticsItem: {
      width: '47%',
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    analyticsItemWide: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    analyticsValue: {
      color: theme.colors.primary,
      fontSize: 26,
      fontWeight: '900',
      marginBottom: theme.spacing.xs,
    },
    analyticsLabel: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    analyticsHint: {
      color: theme.colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
    },
  });
}