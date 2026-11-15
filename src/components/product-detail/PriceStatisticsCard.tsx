import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductPriceStatistics } from '../../types';
import { THEME } from '../../constants/theme';

interface PriceStatisticsCardProps {
  stats: ProductPriceStatistics;
}

export const PriceStatisticsCard = ({ stats }: PriceStatisticsCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Thống Kê Giá & Độ Biến Động</Text>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Giá Thấp Nhất</Text>
          <Text style={[styles.val, { color: THEME.colors.success }]}>
            {stats.minPrice.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Giá Cao Nhất</Text>
          <Text style={[styles.val, { color: THEME.colors.danger }]}>
            {stats.maxPrice.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Giá Trung Bình</Text>
          <Text style={styles.val}>
            {stats.avgPrice.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Độ Biến Động</Text>
          <Text style={[styles.val, { color: THEME.colors.warning }]}>
            ±{stats.volatilityRate}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.base,
    ...THEME.shadows.card,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  label: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  val: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
});
