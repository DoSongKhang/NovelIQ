import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowUpDown,
  Filter,
  Check,
  CheckCircle2,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterChip } from '../../components/common/FilterChip';
import { ProductCard } from '../../components/products/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { CustomButton } from '../../components/common/CustomButton';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';
import { ProductItem } from '../../types';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'discount_desc' | 'rating_desc';

export default function ProductsExplorerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>('default');
  const [onlyOfficial, setOnlyOfficial] = useState(false);
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storeName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategoryId === null || item.categoryId === selectedCategoryId;

      // Official store filter
      const matchesOfficial = !onlyOfficial || item.isOfficialStore;

      // Discount filter
      const matchesDiscount = !onlyDiscounts || item.discountRate > 0;

      return matchesSearch && matchesCategory && matchesOfficial && matchesDiscount;
    }).sort((a, b) => {
      if (selectedSort === 'price_asc') return a.currentPrice - b.currentPrice;
      if (selectedSort === 'price_desc') return b.currentPrice - a.currentPrice;
      if (selectedSort === 'discount_desc') return b.discountRate - a.discountRate;
      if (selectedSort === 'rating_desc') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategoryId, selectedSort, onlyOfficial, onlyDiscounts]);

  const handleProductPress = (product: ProductItem) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  };

  const sortOptionsList = [
    { key: 'default', label: 'Mặc định (Cập nhật gần nhất)' },
    { key: 'discount_desc', label: 'Chiết khấu cao nhất (%)' },
    { key: 'price_asc', label: 'Giá: Thấp đến Cao' },
    { key: 'price_desc', label: 'Giá: Cao đến Thấp' },
    { key: 'rating_desc', label: 'Đánh giá sao cao nhất' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Khám Phá Sản Phẩm"
        subtitle={`${filteredProducts.length} mặt hàng đang theo dõi`}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm kiếm theo tên sách, thiết bị, mã SKU..."
      />

      {/* Horizontal Category Chips */}
      <View style={styles.categoryFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsList}
        >
          <FilterChip
            label="Tất cả danh mục"
            selected={selectedCategoryId === null}
            onPress={() => setSelectedCategoryId(null)}
          />
          {MOCK_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.name}
              selected={selectedCategoryId === cat.id}
              onPress={() => setSelectedCategoryId(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Quick Filter & Sort Bar */}
      <View style={styles.controlBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersList}
        >
          <TouchableOpacity
            style={[styles.sortButton, selectedSort !== 'default' && styles.sortButtonActive]}
            onPress={() => setSortModalVisible(true)}
            activeOpacity={0.7}
          >
            <ArrowUpDown
              size={14}
              color={selectedSort !== 'default' ? THEME.colors.primary : THEME.colors.textSecondary}
            />
            <Text
              style={[
                styles.sortButtonText,
                selectedSort !== 'default' && styles.sortButtonTextActive,
              ]}
            >
              Sắp xếp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickFilterChip, onlyOfficial && styles.quickFilterChipActive]}
            onPress={() => setOnlyOfficial(!onlyOfficial)}
          >
            <CheckCircle2
              size={13}
              color={onlyOfficial ? '#FFFFFF' : THEME.colors.textSecondary}
            />
            <Text
              style={[
                styles.quickFilterChipText,
                onlyOfficial && styles.quickFilterChipTextActive,
              ]}
            >
              Gian hàng chính hãng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickFilterChip, onlyDiscounts && styles.quickFilterChipActive]}
            onPress={() => setOnlyDiscounts(!onlyDiscounts)}
          >
            <Text
              style={[
                styles.quickFilterChipText,
                onlyDiscounts && styles.quickFilterChipTextActive,
              ]}
            >
              Đang giảm giá
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có sản phẩm phù hợp"
            description="Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí lọc."
            actionText="Đặt lại bộ lọc"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedCategoryId(null);
              setSelectedSort('default');
              setOnlyOfficial(false);
              setOnlyDiscounts(false);
            }}
          />
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sắp Xếp Sản Phẩm</Text>
            </View>

            {sortOptionsList.map((opt) => {
              const isSelected = selectedSort === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedSort(opt.key as SortOption);
                    setSortModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Check size={18} color={THEME.colors.primary} />}
                </TouchableOpacity>
              );
            })}

            <CustomButton
              title="Đóng"
              variant="outline"
              size="md"
              onPress={() => setSortModalVisible(false)}
              style={styles.modalCloseButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  categoryFiltersContainer: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  categoryChipsList: {
    paddingHorizontal: THEME.spacing.base,
    gap: 8,
  },
  controlBar: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  quickFiltersList: {
    paddingHorizontal: THEME.spacing.base,
    alignItems: 'center',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  sortButtonActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  sortButtonTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.semibold,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  quickFilterChipActive: {
    backgroundColor: THEME.colors.textPrimary,
    borderColor: THEME.colors.textPrimary,
  },
  quickFilterChipText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  quickFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.weights.semibold,
  },
  listContent: {
    padding: THEME.spacing.base,
    paddingBottom: THEME.spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
  },
  modalHeader: {
    marginBottom: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  modalOptionText: {
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.textSecondary,
  },
  modalOptionTextSelected: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  modalCloseButton: {
    marginTop: THEME.spacing.lg,
  },
});
