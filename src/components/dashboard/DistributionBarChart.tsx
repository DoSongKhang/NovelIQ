import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceDistributionBracket } from '../../types';
import { THEME } from '../../constants/theme';

interface DistributionBarChartProps {
  data: PriceDistributionBracket[];
}

export const DistributionBarChart = ({ data }: DistributionBarChartProps) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.row}>
            <View style={styles.labelCol}>
              <Text style={styles.rangeLabel}>{item.rangeLabel}</Text>
            </View>

            <View style={styles.trackCol}>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor:
                        index === 0
                          ? THEME.colors.primary
                          : index === 1
                          ? THEME.colors.chartIndigo
                          : index === 2
                          ? THEME.colors.chartCyan
                          : index === 3
                          ? THEME.colors.warning
                          : THEME.colors.chartRose,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsCol}>
              <Text style={styles.percentageText}>{item.percentage}%</Text>
              <Text style={styles.countText}>({item.count.toLocaleString()})</Text>
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
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelCol: {
    width: 90,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textPrimary,
  },
  trackCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  track: {
    height: 10,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: THEME.borderRadius.full,
  },
  statsCol: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  countText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
});
