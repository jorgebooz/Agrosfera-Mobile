import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { LoadingScreen } from '../components/LoadingScreen';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import {
  clearSensorHistory,
  getSensorHistory,
} from '../storage/historyStorage';
import { AppTheme } from '../theme';
import { SensorHistoryRecord } from '../types/history';
import { SensorStatus } from '../types/sensor';
import { getStatusLabel } from '../utils/status';

export function HistoryScreen() {
  const { theme } = useAppTheme();

  const [history, setHistory] = useState<SensorHistoryRecord[]>([]);

  const isLoading = useScreenLoading();
  const styles = createStyles(theme);

  const loadHistory = useCallback(async () => {
    const storedHistory = await getSensorHistory();
    setHistory(storedHistory);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  async function handleClearHistory() {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja apagar todas as leituras salvas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearSensorHistory();
            setHistory([]);
          },
        },
      ]
    );
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

  if (isLoading) {
    return <LoadingScreen message="Buscando histórico de leituras..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>
        Acompanhe as leituras salvas dos sensores do cultivo.
      </Text>

      {history.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClearHistory}>
          <Text style={styles.clearButtonText}>Limpar histórico</Text>
        </Pressable>
      )}

      {history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma leitura salva</Text>
          <Text style={styles.emptyDescription}>
            Acesse a tela Monitoramento e toque em “Salvar leitura no histórico”
            para acompanhar os dados depois.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const criticalCount = item.sensors.filter(
              (sensor) => sensor.status === 'critical'
            ).length;

            const attentionCount = item.sensors.filter(
              (sensor) => sensor.status === 'attention'
            ).length;

            const idealCount = item.sensors.filter(
              (sensor) => sensor.status === 'ideal'
            ).length;

            return (
              <View style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={styles.historyTitle}>Leitura registrada</Text>
                    <Text style={styles.historyDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>
                      {item.sensors.length} sensores
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, styles.idealText]}>
                      {idealCount}
                    </Text>
                    <Text style={styles.summaryLabel}>Ideais</Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, styles.warningText]}>
                      {attentionCount}
                    </Text>
                    <Text style={styles.summaryLabel}>Atenção</Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, styles.criticalText]}>
                      {criticalCount}
                    </Text>
                    <Text style={styles.summaryLabel}>Críticos</Text>
                  </View>
                </View>

                <View style={styles.sensorList}>
                  {item.sensors.map((sensor) => (
                    <View key={sensor.id} style={styles.sensorRow}>
                      <View style={styles.sensorInfo}>
                        <Text style={styles.sensorName}>{sensor.name}</Text>
                        <Text
                          style={[
                            styles.sensorStatus,
                            getStatusTextStyle(sensor.status),
                          ]}
                        >
                          {getStatusLabel(sensor.status)}
                        </Text>
                      </View>

                      <Text style={styles.sensorValue}>
                        {sensor.value}
                        {sensor.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
    clearButton: {
      backgroundColor: theme.colors.tertiary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    clearButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
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
      lineHeight: 22,
    },
    listContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    historyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    historyTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    historyDate: {
      color: theme.colors.textMuted,
      fontSize: 13,
    },
    totalBadge: {
      backgroundColor: theme.colors.background,
      borderRadius: 999,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      alignSelf: 'flex-start',
    },
    totalBadgeText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '800',
    },
    summaryRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    summaryItem: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 22,
      fontWeight: '900',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
    },
    idealText: {
      color: theme.colors.success,
    },
    warningText: {
      color: theme.colors.warning,
    },
    criticalText: {
      color: theme.colors.danger,
    },
    sensorList: {
      gap: theme.spacing.sm,
    },
    sensorRow: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    sensorInfo: {
      flex: 1,
    },
    sensorName: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    sensorStatus: {
      fontSize: 12,
      fontWeight: '800',
    },
    sensorValue: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '900',
    },
  });
}