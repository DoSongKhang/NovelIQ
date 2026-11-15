import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = THEME.borderRadius.sm,
  style,
}: SkeletonProps) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <View style={styles.cardSkeleton}>
      <Skeleton width={88} height={88} borderRadius={THEME.borderRadius.md} />
      <View style={styles.contentSkeleton}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 6 }} />
        <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <View style={styles.rowSkeleton}>
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: THEME.colors.border,
  },
  cardSkeleton: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  contentSkeleton: {
    flex: 1,
    marginLeft: THEME.spacing.md,
    justifyContent: 'center',
  },
  rowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
