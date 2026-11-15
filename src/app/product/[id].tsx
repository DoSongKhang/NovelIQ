import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Star,
  ShieldCheck,
  Share2,
  Bookmark,
  ExternalLink,
  Store,
  Layers,
  ChevronRight,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { PriceHistoryChart } from '../../components/product-detail/PriceHistoryChart';
import { PriceStatisticsCard } from '../../components/product-detail/PriceStatisticsCard';
import { CollectionHistoryList } from '../../components/product-detail/CollectionHistoryList';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CustomButton } from '../../components/common/CustomButton';
import { MOCK_PRODUCTS } from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Theo dõi biến động giá Tiki: ${product.name} - Giá hiện tại: ${product.currentPrice.toLocaleString('vi-VN')}₫`,
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Chi Tiết Phân Tích SKU"
        subtitle={product.sku}
        showBack
        onBack={() => router.back()}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setIsBookmarked(!isBookmarked)}
              accessibilityLabel="Lưu theo dõi"
            >
              <Bookmark
                size={18}
                color={isBookmarked ? THEME.colors.primary : THEME.colors.textPrimary}
                fill={isBookmarked ? THEME.colors.primary : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleShare}
              accessibilityLabel="Chia sẻ"
            >
              <Share2 size={18} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Product Card */}
        <View style={styles.mainInfoCard}>
          <View style={styles.imageGalleryWrapper}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productHeroImage}
              resizeMode="cover"
            />
            {product.discountRate > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  -{product.discountRate}% GIẢM
                </Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.skuTag}>
              <Text style={styles.skuText}>ID: {product.id}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Layers size={11} color={THEME.colors.textSecondary} />
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Giá Hiện Tại Trên Sàn</Text>
              <View style={styles.priceValueRow}>
                <Text style={styles.currentPrice}>
                  {product.currentPrice.toLocaleString('vi-VN')}₫
                </Text>
                {product.originalPrice > product.currentPrice && (
                  <Text style={styles.originalPrice}>
                    {product.originalPrice.toLocaleString('vi-VN')}₫
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.ratingBadge}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount} đánh giá)</Text>
            </View>
          </View>

          {/* Store Info Bar */}
          <View style={styles.storeContainer}>
            <View style={styles.storeLeft}>
              <View style={styles.storeIconBox}>
                <Store size={16} color={THEME.colors.primary} />
              </View>
              <View>
                <View style={styles.storeNameRow}>
                  <Text style={styles.storeName}>{product.storeName}</Text>
                  {product.isOfficialStore && (
                    <View style={styles.officialPill}>
                      <ShieldCheck size={11} color={THEME.colors.primary} />
                      <Text style={styles.officialText}>Official Store</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.storeId}>Store ID: {product.storeId}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={THEME.colors.textMuted} />
          </View>
        </View>

        {/* SECTION: HISTORICAL PRICE CHART (Major Visual Element) */}
        <SectionHeader
          title="Biểu Đồ Lịch Sử Giá"
          subtitle="Biến động đơn giá thực tế qua các mốc thời gian thu thập"
          badge="Chỉ số chính"
        />
        <PriceHistoryChart data={product.historicalPrices} />

        {/* SECTION: PRICE STATISTICS */}
        <SectionHeader
          title="Chỉ Số Thống Kê Giá"
          subtitle="Độ biến động và khoảng giá ghi nhận từ hệ thống phân tích"
        />
        <PriceStatisticsCard stats={product.statistics} />

        {/* Product Description */}
        <SectionHeader title="Mô Tả Sản Phẩm" />
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* SECTION: DATA COLLECTION HISTORY */}
        <SectionHeader
          title="Nhật Ký Cào Dữ Liệu"
          subtitle="Lịch sử snapshots các phiên chạy worker crawler"
        />
        <CollectionHistoryList records={product.collectionHistory} />

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  mainInfoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadows.card,
  },
  imageGalleryWrapper: {
    width: '100%',
    height: 220,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceSubtle,
    marginBottom: THEME.spacing.md,
    position: 'relative',
  },
  productHeroImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: THEME.colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  skuTag: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  skuText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontFamily: 'monospace',
    fontWeight: THEME.typography.weights.semibold,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  productTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    lineHeight: 24,
    marginBottom: THEME.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
    marginBottom: THEME.spacing.md,
  },
  priceLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
  },
  currentPrice: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.primaryDark,
  },
  originalPrice: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  ratingBadge: {
    alignItems: 'flex-end',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storeIconBox: {
    width: 32,
    height: 32,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  officialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  officialText: {
    fontSize: 9,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  storeId: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  descriptionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.card,
  },
  descriptionText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
