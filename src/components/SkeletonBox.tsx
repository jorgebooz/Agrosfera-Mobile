import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width = '100%',
  height,
  borderRadius = 12,
  style,
}: SkeletonBoxProps) {
  const { theme, isDarkMode } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const backgroundColor = isDarkMode ? '#2A2A2A' : '#E8E0D8';

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          opacity,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
  },
});