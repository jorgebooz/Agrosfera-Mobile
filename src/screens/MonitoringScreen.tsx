import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '../components/AnimatedPressable';
import { FadeInView } from '../components/FadeInView';
import { ListSkeleton } from '../components/ListSkeleton';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { generateSimulatedSensors } from '../services/sensorService';
import { saveSensorHistoryRecord } from '../storage/historyStorage';
import { AppTheme } from '../theme';
import { SensorData, SensorStatus } from '../types/sensor';
import { getStatusLabel } from '../utils/status';

export function MonitoringScreen() {
  const { theme } = useAppTheme();

  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = useScreenLoading();
  const styles = createStyles(theme);

  useEffect(() => {
    setSensors(generateSimulatedSensors());

    const interval = setInterval(() => {
      setSensors(generateSimulatedSensors());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  async function handleSaveHistory() {
    try {
      setIsSaving(true);

      await saveSensorHistoryRecord({
        id: `history-${Date.now()}`,
        createdAt: new Date().toISOString(),
        sensors,
      });

      Alert.alert(
        'Leitura salva',
        'Os dados atuais dos sensores foram salvos no histórico.'
      );
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar a leitura no histórico.'
      );
    } finally {
      setIsSaving(false);
    }
  }

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

  if (isLoading) {
    return <ListSkeleton titleWidth="62%" showButton items={5} />;
  }

  return (
    <View style={styles.container}>
      <FadeInView delay={60}>
        <Text style={styles.title}>Monitoramento</Text>
        <Text style={styles.subtitle}>
          Sensores simulados atualizados automaticamente.
        </Text>
      </FadeInView>

      <FadeInView delay={120}>
        <AnimatedPressable
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveHistory}
          disabled={isSaving || sensors.length === 0}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Salvando...' : 'Salvar leitura no histórico'}
          </Text>
        </AnimatedPressable>
      </FadeInView>

      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView delay={180 + index * 70}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sensorName}>{item.name}</Text>

                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.sensorValue}>
                {item.value}
                {item.unit}
              </Text>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </FadeInView>
        )}
      />
    </View>
  );
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
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 16,
      marginBottom: theme.spacing.md,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
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
}