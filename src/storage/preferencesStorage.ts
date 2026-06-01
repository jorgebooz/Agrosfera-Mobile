import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@agrosfera:theme-mode';
const CITY_STORAGE_KEY = '@agrosfera:default-city';

export async function getStoredThemeMode(): Promise<ThemeMode> {
  const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return 'light';
}

export async function saveStoredThemeMode(themeMode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
}

export async function getStoredDefaultCity(): Promise<string> {
  const storedCity = await AsyncStorage.getItem(CITY_STORAGE_KEY);

  if (!storedCity) {
    return process.env.EXPO_PUBLIC_DEFAULT_CITY || 'Sao Paulo';
  }

  return storedCity;
}

export async function saveStoredDefaultCity(city: string): Promise<void> {
  await AsyncStorage.setItem(CITY_STORAGE_KEY, city);
}