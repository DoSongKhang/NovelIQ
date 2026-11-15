import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Layers,
  ShoppingBag,
  Store,
  DollarSign,
  TrendingUp,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/common/ChartCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { DistributionBarChart } from '../../components/dashboard/DistributionBarChart';
import { TopCategoriesList } from '../../components/dashboard/TopCategoriesList';
import { RecentActivityFeed } from '../../components/dashboard/RecentActivityFeed';
import { ProductCard } from '../../components/products/ProductCard';
import {
  MOCK_KPI,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_ACTIVITY_CHART,
  MOCK_PRICE_DISTRIBUTION,
} from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';
import { ProductItem } from '../../types';

export default function OverviewDashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleProductPress = (product: ProductItem) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Tiki Intelligence"
        subtitle="Hệ thống giám sát & phân tích giá sàn TMĐT"
        showNotification={true}
        notificationCount={4}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {/* Welcome & Date Info Bar */}
        <View style={styles.dateBar}>
          <Text style={styles.dateText}>
            Hôm nay, 14 Tháng 11, 2026 • 21:15 ICT
          </Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Crawl Live</Text>
          </View>
        </View>

        {/* 2x2 KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiColumn}>
            <StatCard
              label="Tổng sản phẩm"
              value={MOCK_KPI.totalProducts}
              changePercent={MOCK_KPI.totalProductsGrowth}
              icon={<ShoppingBag size={16} color={THEME.colors.primary} />}
            />
          </View>
          <View style={styles.kpiColumn}>
            <StatCard
              label="Danh mục theo dõi"
              value={MOCK_KPI.totalCategories}
              changePercent={MOCK_KPI.totalCategoriesGrowth}
              icon={<Layers size={16} color={THEME.colors.primary} />}
            />
          </View>
          <View style={styles.kpiColumn}>
            <StatCard
              label="Giá TB sàn"
              value={`${(MOCK_KPI.avgPrice / 1000).toFixed(0)}k₫`}
              changePercent={MOCK_KPI.avgPriceChange}
              icon={<DollarSign size={16} color={THEME.colors.primary} />}
            />
          </View>
          <View style={styles.kpiColumn}>
            <StatCard
              label="Gian hàng active"
              value={MOCK_KPI.totalStores}
              changePercent={MOCK_KPI.totalStoresGrowth}
              icon={<Store size={16} color={THEME.colors.primary} />}
            />
          </View>
        </View>

        {/* Chart 1: Product Collection Activity */}
        <ChartCard
          title="Tần suất Thu Thập Dữ Liệu"
          subtitle="Số lượng bản ghi sản phẩm crawl theo chu kỳ 4 giờ"
          badge="Hôm nay"
        >
          <ActivityChart data={MOCK_ACTIVITY_CHART} />
        </ChartCard>

        {/* Chart 2: Product Price Distribution */}
        <ChartCard
          title="Phân Bổ Mức Giá Thị Trường"
          subtitle="Tỷ trọng sản phẩm theo các phân khúc giá phổ biến"
          badge="48.9k SP"
        >
          <DistributionBarChart data={MOCK_PRICE_DISTRIBUTION} />
        </ChartCard>

        {/* Section: Top Categories */}
        <SectionHeader
          title="Top Danh Mục Nổi Bật"
          subtitle="Dựa trên số lượng SKU và tốc độ tăng trưởng tuần"
          actionText="Xem tất cả"
          onActionPress={() => router.push('/(tabs)/analytics')}
        />
        <TopCategoriesList categories={MOCK_CATEGORIES} />

        {/* Section: Recently Updated Products */}
        <SectionHeader
          title="Sản Phẩm Vừa Biến Động Giá"
          subtitle="Các bản ghi cập nhật giá mới nhất từ Tiki"
          actionText="Khám phá thêm"
          onActionPress={() => router.push('/(tabs)/products')}
        />
        <View style={styles.productsList}>
          {MOCK_PRODUCTS.slice(0, 3).map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onPress={handleProductPress}
            />
          ))}
        </View>

        {/* Section: Recent Activity / Logs */}
        <SectionHeader
          title="Hoạt Động Giám Sát Gần Đây"
          subtitle="Nhật ký xử lý ngầm và cảnh báo dị thường hệ thống"
        />
        <RecentActivityFeed />

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
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.base,
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.xxl,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: THEME.colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.success,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: THEME.spacing.md,
  },
  kpiColumn: {
    width: '48%',
  },
  productsList: {
    marginBottom: THEME.spacing.sm,
  },
  bottomSpacer: {
    height: 32,
  },
});
