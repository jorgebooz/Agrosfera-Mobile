import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { darkTheme, lightTheme, AppTheme } from '../theme';
import {
  getStoredThemeMode,
  saveStoredThemeMode,
  ThemeMode,
} from '../storage/preferencesStorage';

interface ThemeContextValue {
  theme: AppTheme;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    async function loadThemeMode() {
      const storedThemeMode = await getStoredThemeMode();
      setThemeMode(storedThemeMode);
    }

    loadThemeMode();
  }, []);

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDarkMode = themeMode === 'dark';

  async function toggleTheme() {
    const nextThemeMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';

    setThemeMode(nextThemeMode);
    await saveStoredThemeMode(nextThemeMode);
  }

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDarkMode,
      toggleTheme,
    }),
    [theme, themeMode, isDarkMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider.');
  }

  return context;
}