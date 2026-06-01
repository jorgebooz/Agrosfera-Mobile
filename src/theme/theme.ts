import { darkColors, lightColors } from './colors';

export const lightTheme = {
  colors: lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: darkColors,
};

export type AppTheme = typeof lightTheme;