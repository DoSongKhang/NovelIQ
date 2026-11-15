import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { THEME } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  changePercent?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard = ({
  label,
  value,
  changePercent,
  changeLabel = 'so với tuần trước',
  icon,
  subtitle,
}: StatCardProps) => {
  const isPositive = (changePercent ?? 0) > 0;
  const isNeutral = (changePercent ?? 0) === 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <Text style={styles.value} numberOfLines={1}>
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {changePercent !== undefined && (
        <View style={styles.footerRow}>
          <View
            style={[
              styles.changeBadge,
              isNeutral
                ? styles.badgeNeutral
                : isPositive
                ? styles.badgePositive
                : styles.badgeNegative,
            ]}
          >
            {isNeutral ? (
              <Minus size={12} color={THEME.colors.textSecondary} />
            ) : isPositive ? (
              <TrendingUp size={12} color={THEME.colors.success} />
            ) : (
              <TrendingDown size={12} color={THEME.colors.danger} />
            )}
            <Text
              style={[
                styles.changeText,
                isNeutral
                  ? styles.textNeutral
                  : isPositive
                  ? styles.textPositive
                  : styles.textNegative,
              ]}
            >
              {isPositive ? `+${changePercent}%` : `${changePercent}%`}
            </Text>
          </View>
          <Text style={styles.changeLabelText} numberOfLines={1}>
            {changeLabel}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xs,
  },
  label: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    padding: 6,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.primaryLight,
  },
  value: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.xs,
    gap: 2,
  },
  badgePositive: {
    backgroundColor: THEME.colors.successLight,
  },
  badgeNegative: {
    backgroundColor: THEME.colors.dangerLight,
  },
  badgeNeutral: {
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  changeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
  },
  textPositive: {
    color: THEME.colors.success,
  },
  textNegative: {
    color: THEME.colors.danger,
  },
  textNeutral: {
    color: THEME.colors.textSecondary,
  },
  changeLabelText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    flexShrink: 1,
  },
});
