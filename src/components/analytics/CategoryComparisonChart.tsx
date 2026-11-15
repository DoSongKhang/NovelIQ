import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategorySummary } from '../../types';
import { THEME } from '../../constants/theme';

interface CategoryComparisonChartProps {
  categories: CategorySummary[];
}

export const CategoryComparisonChart = ({
  categories,
}: CategoryComparisonChartProps) => {
  const maxPrice = Math.max(...categories.map((c) => c.avgPrice), 1);

  return (
    <View style={styles.container}>
      {categories.map((cat, index) => {
        const percent = Math.round((cat.avgPrice / maxPrice) * 100);
        return (
          <View key={cat.id} style={styles.catRow}>
            <View style={styles.nameCol}>
              <Text style={styles.nameText} numberOfLines={1}>
                {cat.name}
              </Text>
            </View>

            <View style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${percent}%`,
                      backgroundColor:
                        index % 2 === 0 ? THEME.colors.primary : THEME.colors.chartIndigo,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.valueCol}>
              <Text style={styles.priceText}>
                {cat.avgPrice >= 1000000
                  ? `${(cat.avgPrice / 1000000).toFixed(1)}M`
                  : `${(cat.avgPrice / 1000).toFixed(0)}k`}₫
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameCol: {
    width: 120,
  },
  nameText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textPrimary,
  },
  barCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  barTrack: {
    height: 12,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: THEME.borderRadius.full,
  },
  valueCol: {
    width: 55,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
});
