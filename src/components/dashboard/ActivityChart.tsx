import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CollectionActivityPoint } from '../../types';
import { THEME } from '../../constants/theme';

interface ActivityChartProps {
  data: CollectionActivityPoint[];
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  const maxVal = Math.max(...data.map((d) => d.collectedCount), 1);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const heightPercent = Math.max(12, Math.round((item.collectedCount / maxVal) * 100));
          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor:
                        index === data.length - 1
                          ? THEME.colors.primary
                          : THEME.colors.primaryBorder,
                    },
                  ]}
                />
              </View>
              <Text style={styles.timeLabel}>{item.timeLabel}</Text>
              <Text style={styles.countLabel}>
                {item.collectedCount >= 1000
                  ? `${(item.collectedCount / 1000).toFixed(1)}k`
                  : item.collectedCount}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.colors.primary }]} />
          <Text style={styles.legendText}>Sản phẩm crawl thành công</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.colors.danger }]} />
          <Text style={styles.legendText}>Cảnh báo lỗi / Retry</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: THEME.spacing.xs,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBackground: {
    width: 22,
    height: 100,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: THEME.borderRadius.xs,
  },
  timeLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    fontWeight: THEME.typography.weights.medium,
  },
  countLabel: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: THEME.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
});
