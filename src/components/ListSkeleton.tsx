import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../theme';
import { SkeletonBox } from './SkeletonBox';

interface ListSkeletonProps {
  titleWidth?: `${number}%`;
  subtitleWidth?: `${number}%`;
  showButton?: boolean;
  items?: number;
}

export function ListSkeleton({
  titleWidth = '58%',
  subtitleWidth = '86%',
  showButton = false,
  items = 4,
}: ListSkeletonProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <SkeletonBox width={titleWidth} height={34} borderRadius={10} />
      <SkeletonBox width={subtitleWidth} height={18} borderRadius={8} style={styles.gapSmall} />
      <SkeletonBox width="70%" height={18} borderRadius={8} style={styles.gapTiny} />

      {showButton && (
        <SkeletonBox height={48} borderRadius={theme.radius.md} style={styles.gapLarge} />
      )}

      <View style={styles.list}>
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonBox
            key={index}
            height={118}
            borderRadius={theme.radius.lg}
            style={styles.item}
          />
        ))}
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
    gapTiny: {
      marginTop: theme.spacing.xs,
    },
    gapSmall: {
      marginTop: theme.spacing.sm,
    },
    gapLarge: {
      marginTop: theme.spacing.lg,
    },
    list: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    item: {
      marginBottom: theme.spacing.md,
    },
  });
}