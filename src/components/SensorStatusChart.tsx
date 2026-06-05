import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../theme';

interface SensorStatusChartProps {
  ideal: number;
  attention: number;
  critical: number;
}

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

export function SensorStatusChart({
  ideal,
  attention,
  critical,
}: SensorStatusChartProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const data: ChartItem[] = [
    {
      label: 'Ideal',
      value: ideal,
      color: theme.colors.success,
    },
    {
      label: 'Atenção',
      value: attention,
      color: theme.colors.warning,
    },
    {
      label: 'Crítico',
      value: critical,
      color: theme.colors.danger,
    },
  ];

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Gráfico dos sensores</Text>
          <Text style={styles.title}>Distribuição por status</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Visualize rapidamente a condição geral do ambiente de cultivo.
      </Text>

      <View style={styles.chart}>
        {data.map((item) => {
          const heightPercentage = Math.max((item.value / maxValue) * 100, 8);

          return (
            <View key={item.label} style={styles.column}>
              <View style={styles.barArea}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercentage}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>

              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
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
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    chart: {
      height: 170,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    column: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    barArea: {
      height: 115,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      overflow: 'hidden',
    },
    bar: {
      width: '100%',
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
      minHeight: 8,
    },
    value: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: '900',
      marginTop: theme.spacing.sm,
    },
    label: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      marginTop: theme.spacing.xs,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    legendText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
  });
}