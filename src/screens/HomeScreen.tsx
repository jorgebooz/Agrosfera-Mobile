import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { FadeInView } from '../components/FadeInView';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { getAPOD } from '../services/nasaService';
import { generateSimulatedSensors } from '../services/sensorService';
import { getCurrentWeather } from '../services/weatherService';
import { getStoredDefaultCity } from '../storage/preferencesStorage';
import { AppTheme } from '../theme';
import { APODData } from '../types/nasa';
import { SensorData, SensorStatus } from '../types/sensor';
import { WeatherData } from '../types/weather';
import { getStatusLabel } from '../utils/status';

export function HomeScreen() {
  const { theme } = useAppTheme();

  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [apod, setApod] = useState<APODData | null>(null);
  const [apodError, setApodError] = useState<string | null>(null);

  const isLoading = useScreenLoading();
  const styles = createStyles(theme);

  useEffect(() => {
    setSensors(generateSimulatedSensors());

    const interval = setInterval(() => {
      setSensors(generateSimulatedSensors());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const loadWeather = useCallback(async () => {
    try {
      setWeatherError(null);

      const storedCity = await getStoredDefaultCity();
      const data = await getCurrentWeather(storedCity);

      setWeather(data);
    } catch {
      setWeatherError('Não foi possível carregar os dados climáticos agora.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeather();
    }, [loadWeather])
  );

  useEffect(() => {
    async function loadAPOD() {
      try {
        setApodError(null);
        const data = await getAPOD();
        setApod(data);
      } catch {
        setApodError('Não foi possível carregar a inspiração espacial agora.');
      }
    }

    loadAPOD();
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Agrosfera Mobile</Text>
      <Text style={styles.title}>Home do cultivo</Text>
      <Text style={styles.subtitle}>
        Acompanhe os principais dados do ambiente de cultivo em tempo real.
      </Text>

            <FadeInView delay={80}>
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View>
              <Text style={styles.weatherLabel}>Clima externo</Text>
              <Text style={styles.weatherCity}>
                {weather?.city || 'Cidade não carregada'}
              </Text>
            </View>

            <Text style={styles.weatherTemperature}>
              {weather ? `${weather.temperature}°C` : '--°C'}
            </Text>
          </View>

          {weatherError ? (
            <Text style={styles.errorText}>{weatherError}</Text>
          ) : (
            <>
              <Text style={styles.weatherDescription}>
                {weather?.description || 'Aguardando dados climáticos'}
              </Text>

              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailValue}>
                    {weather ? `${weather.humidity}%` : '--'}
                  </Text>
                  <Text style={styles.weatherDetailLabel}>Umidade</Text>
                </View>

                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailValue}>
                    {weather ? `${weather.feelsLike}°C` : '--'}
                  </Text>
                  <Text style={styles.weatherDetailLabel}>Sensação</Text>
                </View>

                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailValue}>
                    {weather ? `${weather.windSpeed} m/s` : '--'}
                  </Text>
                  <Text style={styles.weatherDetailLabel}>Vento</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </FadeInView>

      <FadeInView delay={140}>
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

      <FadeInView delay={200}>
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
      </FadeInView>

      <FadeInView delay={260}>
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
      </FadeInView>

      <FadeInView delay={320}>
        <View style={styles.apodCard}>
          <Text style={styles.apodKicker}>NASA APOD</Text>
          <Text style={styles.apodTitle}>Inspiração espacial do dia</Text>

          {apodError ? (
            <Text style={styles.errorText}>{apodError}</Text>
          ) : (
            <>
              {apod?.mediaType === 'image' ? (
                <Image source={{ uri: apod.url }} style={styles.apodImage} />
              ) : (
                <View style={styles.apodFallback}>
                  <Text style={styles.apodFallbackText}>
                    Conteúdo espacial disponível, mas o formato de hoje não é uma imagem.
                  </Text>
                </View>
              )}

              <Text style={styles.apodName}>{apod?.title || 'Carregando título'}</Text>
              <Text style={styles.apodDate}>{apod?.date || '--'}</Text>
              <Text style={styles.apodDescription}>
                {shortenText(
                  apod?.explanation ||
                    'Aguardando descrição da imagem astronômica do dia.'
                )}
              </Text>
            </>
          )}
        </View>
      </FadeInView>
    </ScrollView>
  );
}

function shortenText(text: string, limit = 220): string {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim()}...`;
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
    weatherCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    weatherHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    weatherLabel: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    weatherCity: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: '800',
    },
    weatherTemperature: {
      color: theme.colors.primary,
      fontSize: 34,
      fontWeight: '900',
    },
    weatherDescription: {
      color: theme.colors.textMuted,
      fontSize: 15,
      lineHeight: 21,
      textTransform: 'capitalize',
      marginBottom: theme.spacing.md,
    },
    weatherDetails: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    weatherDetailItem: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
    },
    weatherDetailValue: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    weatherDetailLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
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
    apodCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    apodKicker: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: theme.spacing.xs,
    },
    apodTitle: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: '800',
      marginBottom: theme.spacing.md,
    },
    apodImage: {
      width: '100%',
      height: 180,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    apodFallback: {
      minHeight: 120,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    apodFallbackText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    apodName: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    apodDate: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginBottom: theme.spacing.sm,
    },
    apodDescription: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    errorText: {
      color: theme.colors.danger,
      fontSize: 14,
      lineHeight: 20,
    },
  });
}