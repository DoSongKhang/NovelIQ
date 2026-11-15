import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react-native';
import { ProductItem } from '../../types';
import { THEME } from '../../constants/theme';

interface ProductCardProps {
  product: ProductItem;
  onPress: (product: ProductItem) => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {product.discountRate > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discountRate}%</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.skuBadge}>
            <Text style={styles.skuText}>{product.sku}</Text>
          </View>
          <Text style={styles.categoryTag} numberOfLines={1}>
            {product.category}
          </Text>
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {product.currentPrice.toLocaleString('vi-VN')}₫
          </Text>
          {product.originalPrice > product.currentPrice && (
            <Text style={styles.originalPrice}>
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCountText}>
              ({product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
            </Text>
          </View>

          <View style={styles.storeBadge}>
            {product.isOfficialStore && (
              <ShieldCheck size={11} color={THEME.colors.primary} />
            )}
            <Text style={styles.storeName} numberOfLines={1}>
              {product.storeName}
            </Text>
          </View>
        </View>

        {product.statistics.allTimeLowest && (
          <View style={styles.analyticsAlert}>
            <TrendingDown size={11} color={THEME.colors.success} />
            <Text style={styles.analyticsAlertText}>Đang ở mức giá thấp nhất lịch sử</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadows.card,
  },
  imageContainer: {
    width: 90,
    height: 110,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceSubtle,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: THEME.colors.danger,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.xs,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
  },
  content: {
    flex: 1,
    marginLeft: THEME.spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skuBadge: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skuText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.semibold,
  },
  categoryTag: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    maxWidth: 120,
  },
  productName: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  currentPrice: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primaryDark,
  },
  originalPrice: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  reviewCountText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: 110,
  },
  storeName: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  analyticsAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: THEME.colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  analyticsAlertText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.success,
  },
});
