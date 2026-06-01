import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function useScreenLoading(delay = 1000) {
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, delay);

      return () => clearTimeout(timeout);
    }, [delay])
  );

  return isLoading;
}