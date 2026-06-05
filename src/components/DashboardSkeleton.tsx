import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../theme';
import { SkeletonBox } from './SkeletonBox';

export function DashboardSkeleton() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SkeletonBox width="38%" height={14} borderRadius={8} />
      <SkeletonBox width="82%" height={34} borderRadius={10} style={styles.gapSmall} />
      <SkeletonBox width="95%" height={18} borderRadius={8} style={styles.gapSmall} />
      <SkeletonBox width="75%" height={18} borderRadius={8} style={styles.gapTiny} />

      <SkeletonBox height={130} borderRadius={theme.radius.lg} style={styles.gapLarge} />

      <SkeletonBox height={145} borderRadius={theme.radius.lg} style={styles.gapMedium} />

      <View style={styles.grid}>
        <SkeletonBox width="47%" height={92} borderRadius={theme.radius.md} />
        <SkeletonBox width="47%" height={92} borderRadius={theme.radius.md} />
        <SkeletonBox width="47%" height={92} borderRadius={theme.radius.md} />
        <SkeletonBox width="47%" height={92} borderRadius={theme.radius.md} />
      </View>

      <SkeletonBox width="56%" height={24} borderRadius={8} style={styles.gapLarge} />

      <SkeletonBox height={84} borderRadius={theme.radius.md} style={styles.gapMedium} />
      <SkeletonBox height={84} borderRadius={theme.radius.md} style={styles.gapMedium} />
      <SkeletonBox height={84} borderRadius={theme.radius.md} style={styles.gapMedium} />

      <SkeletonBox height={230} borderRadius={theme.radius.lg} style={styles.gapLarge} />
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    gapTiny: {
      marginTop: theme.spacing.xs,
    },
    gapSmall: {
      marginTop: theme.spacing.sm,
    },
    gapMedium: {
      marginTop: theme.spacing.md,
    },
    gapLarge: {
      marginTop: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
  });
}