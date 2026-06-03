import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingScreen } from './src/components/LoadingScreen';
import { ThemeProvider, useAppTheme } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppContent() {
  const { isDarkMode } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Inicializando Agrosfera Mobile..." />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}