import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AnimatedPressable } from '../components/AnimatedPressable';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import { clearSensorHistory } from '../storage/historyStorage';
import {
  getStoredDefaultCity,
  saveStoredDefaultCity,
} from '../storage/preferencesStorage';
import { AppTheme } from '../theme';

export function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useAppTheme();

  const [city, setCity] = useState('');
  const [isSavingCity, setIsSavingCity] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  const isLoading = useScreenLoading();
  const styles = createStyles(theme);

  useEffect(() => {
    async function loadCity() {
      const storedCity = await getStoredDefaultCity();
      setCity(storedCity);
    }

    loadCity();
  }, []);

  async function handleSaveCity() {
    const formattedCity = city.trim();

    if (!formattedCity) {
      Alert.alert('Cidade inválida', 'Informe uma cidade para salvar.');
      return;
    }

    try {
      setIsSavingCity(true);
      await saveStoredDefaultCity(formattedCity);

      Alert.alert(
        'Cidade salva',
        'A cidade padrão foi atualizada com sucesso.'
      );
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar a cidade padrão.'
      );
    } finally {
      setIsSavingCity(false);
    }
  }

  async function clearHistory() {
    try {
      setIsClearingHistory(true);
      await clearSensorHistory();

      Alert.alert(
        'Histórico limpo',
        'As leituras salvas foram apagadas com sucesso.'
      );
    } catch {
      Alert.alert(
        'Erro ao limpar',
        'Não foi possível apagar o histórico agora.'
      );
    } finally {
      setIsClearingHistory(false);
    }
  }

  function handleClearHistory() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Tem certeza que deseja apagar todas as leituras salvas?'
      );

      if (confirmed) {
        clearHistory();
      }

      return;
    }

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
          onPress: clearHistory,
        },
      ]
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Carregando preferências..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.subtitle}>
        Personalize sua experiência no Agrosfera Mobile.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.cardTitle}>Modo escuro</Text>
            <Text style={styles.cardDescription}>
              Ajuste a aparência do app para uma visualização mais confortável.
            </Text>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor="#FFFFFF"
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cidade padrão</Text>
        <Text style={styles.cardDescription}>
          Escolha a cidade usada como referência para os dados climáticos do
          cultivo.
        </Text>

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Sao Paulo,BR"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <AnimatedPressable
          style={[styles.primaryButton, isSavingCity && styles.disabledButton]}
          onPress={handleSaveCity}
          disabled={isSavingCity}
        >
          <Text style={styles.primaryButtonText}>
            {isSavingCity ? 'Salvando...' : 'Salvar cidade padrão'}
          </Text>
        </AnimatedPressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Histórico de leituras</Text>
        <Text style={styles.cardDescription}>
          Apague as leituras salvas caso queira começar um novo acompanhamento
          do cultivo.
        </Text>

        <AnimatedPressable
          style={[
            styles.dangerButton,
            isClearingHistory && styles.disabledButton,
          ]}
          onPress={handleClearHistory}
          disabled={isClearingHistory}
        >
          <Text style={styles.dangerButtonText}>
            {isClearingHistory ? 'Limpando...' : 'Limpar histórico'}
          </Text>
        </AnimatedPressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sobre o app</Text>
        <Text style={styles.cardDescription}>
          O Agrosfera Mobile monitora um ambiente de cultivo controlado usando
          dados climáticos, sensores inteligentes, histórico de leituras e
          conexão com a indústria espacial.
        </Text>

        <View style={styles.techList}>
          <Text style={styles.techItem}>React Native</Text>
          <Text style={styles.techItem}>Expo SDK 55</Text>
          <Text style={styles.techItem}>TypeScript</Text>
          <Text style={styles.techItem}>OpenWeather</Text>
          <Text style={styles.techItem}>NASA APOD</Text>
          <Text style={styles.techItem}>Histórico de leituras</Text>
        </View>
      </View>
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
      fontWeight: '800',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 16,
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    rowText: {
      flex: 1,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: theme.spacing.sm,
    },
    cardDescription: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      color: theme.colors.text,
      fontSize: 15,
      marginBottom: theme.spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
    },
    dangerButton: {
      backgroundColor: '#D94F30',
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F26A1B',
    },
    dangerButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
      letterSpacing: 0.2,
    },
    disabledButton: {
      opacity: 0.6,
    },
    techList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    techItem: {
      backgroundColor: theme.colors.background,
      borderRadius: 999,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '800',
    },
  });
}