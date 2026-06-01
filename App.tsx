import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingScreen } from './src/components/LoadingScreen';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
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
    <ThemeProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}