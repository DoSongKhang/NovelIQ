import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react-native';
import { CategorySummary } from '../../types';
import { THEME } from '../../constants/theme';

interface TopCategoriesListProps {
  categories: CategorySummary[];
  onSelectCategory?: (category: CategorySummary) => void;
}

export const TopCategoriesList = ({
  categories,
  onSelectCategory,
}: TopCategoriesListProps) => {
  return (
    <View style={styles.container}>
      {categories.map((cat, index) => {
        const isPositive = cat.growthRate >= 0;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.itemRow,
              index !== categories.length - 1 && styles.borderBottom,
            ]}
            onPress={() => onSelectCategory && onSelectCategory(cat)}
            activeOpacity={0.7}
          >
            <View style={styles.leftInfo}>
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>#{index + 1}</Text>
              </View>
              <View>
                <Text style={styles.catName} numberOfLines={1}>
                  {cat.name}
                </Text>
                <Text style={styles.catMeta}>
                  {cat.productCount.toLocaleString()} SP • TB: {cat.avgPrice.toLocaleString()}₫
                </Text>
              </View>
            </View>

            <View style={styles.rightInfo}>
              <View
                style={[
                  styles.growthBadge,
                  isPositive ? styles.growthPositive : styles.growthNegative,
                ]}
              >
                {isPositive ? (
                  <TrendingUp size={11} color={THEME.colors.success} />
                ) : (
                  <TrendingDown size={11} color={THEME.colors.danger} />
                )}
                <Text
                  style={[
                    styles.growthText,
                    isPositive ? styles.growthTextPositive : styles.growthTextNegative,
                  ]}
                >
                  {isPositive ? `+${cat.growthRate}%` : `${cat.growthRate}%`}
                </Text>
              </View>
              <ChevronRight size={16} color={THEME.colors.textMuted} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    ...THEME.shadows.card,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  indexText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textSecondary,
  },
  catName: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  catMeta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.xs,
  },
  growthPositive: {
    backgroundColor: THEME.colors.successLight,
  },
  growthNegative: {
    backgroundColor: THEME.colors.dangerLight,
  },
  growthText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
  },
  growthTextPositive: {
    color: THEME.colors.success,
  },
  growthTextNegative: {
    color: THEME.colors.danger,
  },
});
