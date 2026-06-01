import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LoadingScreen } from '../components/LoadingScreen';
import { useAppTheme } from '../contexts/ThemeContext';
import { useScreenLoading } from '../hooks/useScreenLoading';
import {
  getStoredDefaultCity,
  saveStoredDefaultCity,
} from '../storage/preferencesStorage';

export function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useAppTheme();

  const [city, setCity] = useState('');
  const [isSavingCity, setIsSavingCity] = useState(false);

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
        'A cidade padrão foi salva localmente com AsyncStorage.'
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

  if (isLoading) {
    return <LoadingScreen message="Carregando preferências..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.subtitle}>
        Personalize preferências locais do Agrosfera Mobile.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.cardTitle}>Modo escuro</Text>
            <Text style={styles.cardDescription}>
              Alterna a navegação e as telas preparadas para dark/light mode.
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
          Essa cidade será usada como referência para os dados climáticos da
          OpenWeather.
        </Text>

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Sao Paulo"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, isSavingCity && styles.disabledButton]}
          onPress={handleSaveCity}
          disabled={isSavingCity}
        >
          <Text style={styles.primaryButtonText}>
            {isSavingCity ? 'Salvando...' : 'Salvar cidade padrão'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sobre o app</Text>
        <Text style={styles.cardDescription}>
          O Agrosfera Mobile monitora um ambiente de cultivo controlado usando
          dados climáticos, sensores IoT simulados, persistência local e
          conexão conceitual com a indústria espacial.
        </Text>

        <View style={styles.techList}>
          <Text style={styles.techItem}>React Native</Text>
          <Text style={styles.techItem}>Expo SDK 55</Text>
          <Text style={styles.techItem}>TypeScript</Text>
          <Text style={styles.techItem}>OpenWeather API</Text>
          <Text style={styles.techItem}>NASA APOD</Text>
          <Text style={styles.techItem}>AsyncStorage</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>['theme']) {
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
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
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