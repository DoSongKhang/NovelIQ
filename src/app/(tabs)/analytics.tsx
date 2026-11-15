import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/common/ChartCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CategoryComparisonChart } from '../../components/analytics/CategoryComparisonChart';
import { DistributionBarChart } from '../../components/dashboard/DistributionBarChart';
import {
  MOCK_CATEGORIES,
  MOCK_PRICE_DISTRIBUTION,
  MOCK_PRODUCTS,
} from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';

export default function AnalyticsDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'trends'>('overview');

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Trung Tâm Phân Tích"
        subtitle="Business Intelligence & Thị phần ngành hàng"
      />

      {/* Analytics Sub Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[styles.tabItemText, activeTab === 'overview' && styles.tabItemTextActive]}
          >
            Tổng Quan Sàn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'categories' && styles.tabItemActive]}
          onPress={() => setActiveTab('categories')}
        >
          <Text
            style={[styles.tabItemText, activeTab === 'categories' && styles.tabItemTextActive]}
          >
            So Sánh Danh Mục
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'trends' && styles.tabItemActive]}
          onPress={() => setActiveTab('trends')}
        >
          <Text
            style={[styles.tabItemText, activeTab === 'trends' && styles.tabItemTextActive]}
          >
            Xu Hướng Giá
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Summary Bar */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>48.920</Text>
            <Text style={styles.metricLabel}>SKU Thu Thập</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: THEME.colors.primary }]}>
              285.400₫
            </Text>
            <Text style={styles.metricLabel}>Giá Bình Quân</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: THEME.colors.success }]}>
              +18.4%
            </Text>
            <Text style={styles.metricLabel}>Tỷ Lệ Giảm Giá TB</Text>
          </View>
        </View>

        {/* Category Price Comparison */}
        <ChartCard
          title="Giá Bình Quân Theo Danh Mục"
          subtitle="So sánh tương quan mức giá giữa các ngành hàng trên Tiki"
          badge="Cập nhật hôm nay"
        >
          <CategoryComparisonChart categories={MOCK_CATEGORIES} />
        </ChartCard>

        {/* Price Distribution */}
        <ChartCard
          title="Phân Cụm Khoảng Giá Toàn Sàn"
          subtitle="Mật độ phân bổ hàng hóa theo từng ngưỡng ngân sách"
        >
          <DistributionBarChart data={MOCK_PRICE_DISTRIBUTION} />
        </ChartCard>

        {/* Volatility & Discount Performance */}
        <ChartCard
          title="Biên Độ Chiết Khấu Theo Ngành Hàng"
          subtitle="Tỷ lệ giảm giá trung bình niêm yết bởi các shop"
        >
          <View style={styles.discountPerformanceList}>
            {MOCK_CATEGORIES.map((c, i) => {
              const discountRates = [32, 18, 26, 38, 14];
              const rate = discountRates[i % discountRates.length];
              return (
                <View key={c.id} style={styles.discountItem}>
                  <View style={styles.discountHeader}>
                    <Text style={styles.catTitle}>{c.name}</Text>
                    <Text style={styles.discountPercent}>-{rate}% TB</Text>
                  </View>
                  <View style={styles.discountTrack}>
                    <View
                      style={[
                        styles.discountFill,
                        {
                          width: `${rate * 2}%`,
                          backgroundColor:
                            rate > 30 ? THEME.colors.danger : THEME.colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ChartCard>

        {/* Top-Rated Products */}
        <SectionHeader
          title="Top Sản Phẩm Đánh Giá Cao Nhất"
          subtitle="Chỉ số tin cậy kết hợp giữa Rating sao và số lượt Review"
        />
        <View style={styles.topRatedCard}>
          {MOCK_PRODUCTS.slice(0, 3).map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.topRatedRow,
                index !== 2 && styles.topRatedBorder,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/product/[id]',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.topRatedLeft}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.topRatedText}>
                  <Text style={styles.topRatedName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.topRatedMeta}>
                    {item.category} • {item.currentPrice.toLocaleString('vi-VN')}₫
                  </Text>
                </View>
              </View>

              <View style={styles.topRatedScore}>
                <Text style={styles.scoreVal}>★ {item.rating.toFixed(1)}</Text>
                <Text style={styles.scoreReviews}>
                  {item.reviewCount >= 1000
                    ? `${(item.reviewCount / 1000).toFixed(1)}k`
                    : item.reviewCount}{' '}
                  đánh giá
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: THEME.colors.primary,
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  tabItemTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.base,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: THEME.spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    ...THEME.shadows.card,
  },
  metricVal: {
    fontSize: 16,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  discountPerformanceList: {
    width: '100%',
    gap: 12,
  },
  discountItem: {
    gap: 4,
  },
  discountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catTitle: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weights.medium,
  },
  discountPercent: {
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weights.bold,
  },
  discountTrack: {
    height: 8,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  discountFill: {
    height: '100%',
    borderRadius: THEME.borderRadius.full,
  },
  topRatedCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    ...THEME.shadows.card,
  },
  topRatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
  },
  topRatedBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  topRatedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textSecondary,
  },
  topRatedText: {
    flex: 1,
  },
  topRatedName: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  topRatedMeta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  topRatedScore: {
    alignItems: 'flex-end',
  },
  scoreVal: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: '#D97706',
  },
  scoreReviews: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  bottomSpacer: {
    height: 36,
  },
});
