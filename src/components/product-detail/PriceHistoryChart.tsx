import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PriceHistoryPoint } from '../../types';
import { THEME } from '../../constants/theme';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
}

export const PriceHistoryChart = ({ data }: PriceHistoryChartProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(data.length - 1);
  const [selectedRange, setSelectedRange] = useState<'30D' | '60D' | '90D' | 'ALL'>('30D');

  if (!data || data.length === 0) return null;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDiff = maxPrice - minPrice || 1;

  const activePoint = data[selectedIndex] || data[data.length - 1];

  return (
    <View style={styles.container}>
      {/* Time Range Selector */}
      <View style={styles.rangeSelector}>
        {(['30D', '60D', '90D', 'ALL'] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeTab,
              selectedRange === range && styles.rangeTabActive,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[
                styles.rangeText,
                selectedRange === range && styles.rangeTextActive,
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Point Callout */}
      <View style={styles.calloutCard}>
        <View>
          <Text style={styles.calloutDate}>Ngày ghi nhận: {activePoint.date}</Text>
          <Text style={styles.calloutPrice}>
            {activePoint.price.toLocaleString('vi-VN')}₫
          </Text>
        </View>
        <View style={styles.calloutStatus}>
          {activePoint.price === minPrice ? (
            <View style={styles.minBadge}>
              <Text style={styles.minBadgeText}>Giá thấp nhất đợt</Text>
            </View>
          ) : activePoint.price === maxPrice ? (
            <View style={styles.maxBadge}>
              <Text style={styles.maxBadgeText}>Giá cao nhất đợt</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Visual Chart Area */}
      <View style={styles.chartArea}>
        {/* Y-axis Guides */}
        <View style={styles.guideRow}>
          <Text style={styles.guideText}>Max: {maxPrice.toLocaleString('vi-VN')}₫</Text>
          <View style={styles.dashLine} />
        </View>
        <View style={[styles.guideRow, { top: '50%' }]}>
          <Text style={styles.guideText}>
            TB: {Math.round((maxPrice + minPrice) / 2).toLocaleString('vi-VN')}₫
          </Text>
          <View style={styles.dashLine} />
        </View>
        <View style={[styles.guideRow, { top: '90%' }]}>
          <Text style={styles.guideText}>Min: {minPrice.toLocaleString('vi-VN')}₫</Text>
          <View style={styles.dashLine} />
        </View>

        {/* Interactive Points & Connected Bars */}
        <View style={styles.pointsTrack}>
          {data.map((point, idx) => {
            const normalizedHeight = ((point.price - minPrice) / priceDiff) * 80 + 15;
            const isSelected = idx === selectedIndex;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.pointColumn}
                onPress={() => setSelectedIndex(idx)}
                activeOpacity={0.7}
              >
                <View style={styles.pointTrackInner}>
                  {/* Vertical Guideline */}
                  <View
                    style={[
                      styles.verticalGuide,
                      isSelected && styles.verticalGuideActive,
                    ]}
                  />

                  {/* Dot Node */}
                  <View
                    style={[
                      styles.dotNode,
                      { bottom: `${normalizedHeight}%` },
                      isSelected && styles.dotNodeActive,
                    ]}
                  >
                    {isSelected && <View style={styles.dotCenter} />}
                  </View>
                </View>
                <Text style={[styles.xAxisDate, isSelected && styles.xAxisDateActive]}>
                  {point.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Text style={styles.chartFootnote}>
        * Chạm vào các mốc thời gian để xem chi tiết biến động giá theo ngày.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    padding: 3,
    marginBottom: THEME.spacing.md,
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  rangeTabActive: {
    backgroundColor: THEME.colors.surface,
    ...THEME.shadows.card,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  rangeTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  calloutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.base,
  },
  calloutDate: {
    fontSize: 11,
    color: THEME.colors.primaryDark,
    fontWeight: THEME.typography.weights.medium,
  },
  calloutPrice: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
    marginTop: 2,
  },
  calloutStatus: {
    alignItems: 'flex-end',
  },
  minBadge: {
    backgroundColor: THEME.colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
  },
  minBadgeText: {
    color: THEME.colors.success,
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
  },
  maxBadge: {
    backgroundColor: THEME.colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
  },
  maxBadgeText: {
    color: THEME.colors.danger,
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
  },
  chartArea: {
    height: 180,
    position: 'relative',
    marginVertical: THEME.spacing.sm,
  },
  guideRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  guideText: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    width: 90,
  },
  dashLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.borderLight,
  },
  pointsTrack: {
    flexDirection: 'row',
    height: '100%',
    paddingLeft: 90,
    zIndex: 2,
  },
  pointColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  pointTrackInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  verticalGuide: {
    width: 1,
    height: '100%',
    backgroundColor: 'transparent',
  },
  verticalGuideActive: {
    backgroundColor: THEME.colors.primaryBorder,
  },
  dotNode: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: THEME.colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.card,
  },
  dotNodeActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.colors.primaryDark,
    borderWidth: 3,
  },
  dotCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  xAxisDate: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    fontWeight: THEME.typography.weights.medium,
  },
  xAxisDateActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  chartFootnote: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
});
