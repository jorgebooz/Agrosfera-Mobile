import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { LoadingScreen } from '../components/LoadingScreen';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { generateAlertsFromSensors } from '../services/alertService';
import { generateSimulatedSensors } from '../services/sensorService';
import { lightTheme } from '../theme';
import { CultivationAlert } from '../types/alert';

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<CultivationAlert[]>([]);
  const isLoading = useScreenLoading();

  useEffect(() => {
    const sensors = generateSimulatedSensors();
    setAlerts(generateAlertsFromSensors(sensors));

    const interval = setInterval(() => {
      const updatedSensors = generateSimulatedSensors();
      setAlerts(generateAlertsFromSensors(updatedSensors));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const summary = useMemo(() => {
    const critical = alerts.filter((alert) => alert.severity === 'critical').length;
    const attention = alerts.filter((alert) => alert.severity === 'attention').length;

    return {
      total: alerts.length,
      critical,
      attention,
    };
  }, [alerts]);

  if (isLoading) {
    return <LoadingScreen message="Verificando alertas do ambiente..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      <Text style={styles.subtitle}>
        Recomendações geradas a partir dos sensores simulados do cultivo.
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.total}</Text>
          <Text style={styles.summaryLabel}>Alertas ativos</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.criticalText]}>
            {summary.critical}
          </Text>
          <Text style={styles.summaryLabel}>Críticos</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.warningText]}>
            {summary.attention}
          </Text>
          <Text style={styles.summaryLabel}>Atenção</Text>
        </View>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum alerta ativo</Text>
          <Text style={styles.emptyDescription}>
            Todos os sensores estão dentro da faixa ideal no momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.alertCard, getAlertCardStyle(item.severity)]}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <View style={[styles.badge, getBadgeStyle(item.severity)]}>
                  <Text style={styles.badgeText}>
                    {item.severity === 'critical' ? 'Crítico' : 'Atenção'}
                  </Text>
                </View>
              </View>

              <Text style={styles.alertDescription}>{item.description}</Text>

              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationLabel}>Recomendação</Text>
                <Text style={styles.recommendationText}>
                  {item.recommendation}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const theme = lightTheme;

function getAlertCardStyle(severity: CultivationAlert['severity']) {
  switch (severity) {
    case 'critical':
      return { borderLeftColor: theme.colors.danger };
    case 'attention':
      return { borderLeftColor: theme.colors.warning };
    default:
      return { borderLeftColor: theme.colors.border };
  }
}

function getBadgeStyle(severity: CultivationAlert['severity']) {
  switch (severity) {
    case 'critical':
      return { backgroundColor: theme.colors.danger };
    case 'attention':
      return { backgroundColor: theme.colors.warning };
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
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  criticalText: {
    color: theme.colors.danger,
  },
  warningText: {
    color: theme.colors.warning,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  alertCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  alertTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  alertDescription: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  recommendationBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  recommendationLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recommendationText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});