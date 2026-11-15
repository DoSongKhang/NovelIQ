import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  Sparkles,
  Brain,
  AlertTriangle,
  Layers,
  TrendingDown,
  Info,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InsightCard } from '../../components/insights/InsightCard';
import { FilterChip } from '../../components/common/FilterChip';
import { MOCK_AI_INSIGHTS } from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';
import { AIInsightItem } from '../../types';

export default function AIInsightsScreen() {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredInsights = MOCK_AI_INSIGHTS.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Trí Tuệ Nhân Tạo & Insights"
        subtitle="Mô hình Machine Learning dự báo & phát hiện dị thường"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ML Overview Banner */}
        <View style={styles.modelOverviewCard}>
          <View style={styles.modelHeader}>
            <View style={styles.modelIconBox}>
              <Brain size={20} color={THEME.colors.primary} />
            </View>
            <View style={styles.modelTitleArea}>
              <Text style={styles.modelName}>Tiki Price Oracle v2.4</Text>
              <Text style={styles.modelMeta}>
                Cập nhật mô hình: 14/11/2026 • 94.2% Độ chính xác
              </Text>
            </View>
          </View>

          <Text style={styles.modelDesc}>
            Hệ thống phân tích đồng thời chuỗi thời gian giá (Time-series Forecasting), phát hiện
            bất thường phân phối giá (Isolation Forest) và gom cụm phân khúc sản phẩm (K-Means Clustering).
          </Text>

          <View style={styles.modelStatsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statPillNumber}>4</Text>
              <Text style={styles.statPillLabel}>Insights mới</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={[styles.statPillNumber, { color: THEME.colors.danger }]}>1</Text>
              <Text style={styles.statPillLabel}>Cảnh báo dị thường</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={[styles.statPillNumber, { color: THEME.colors.success }]}>91.5%</Text>
              <Text style={styles.statPillLabel}>Tin cậy TB</Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip
              label="Tất cả (4)"
              selected={filterType === 'all'}
              onPress={() => setFilterType('all')}
            />
            <FilterChip
              label="Dự báo giá"
              selected={filterType === 'prediction'}
              onPress={() => setFilterType('prediction')}
            />
            <FilterChip
              label="Dị thường"
              selected={filterType === 'anomaly'}
              onPress={() => setFilterType('anomaly')}
            />
            <FilterChip
              label="Phân cụm SP"
              selected={filterType === 'clustering'}
              onPress={() => setFilterType('clustering')}
            />
            <FilterChip
              label="Xu hướng"
              selected={filterType === 'trend'}
              onPress={() => setFilterType('trend')}
            />
          </ScrollView>
        </View>

        {/* Dynamic List of AI Insights */}
        <SectionHeader
          title="Khuyến Nghị & Báo Cáo Phân Tích"
          subtitle="Tự động trích xuất từ dữ liệu cào giá định kỳ"
        />

        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}

        <View style={styles.infoBox}>
          <Info size={16} color={THEME.colors.primary} />
          <Text style={styles.infoBoxText}>
            Các insight được sinh ra tự động từ các mô hình học máy trên dữ liệu crawl Tiki. Các nhà bán lẻ có thể sử dụng làm căn cứ tham khảo để tối ưu hóa chiến lược định giá.
          </Text>
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
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.base,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  modelOverviewCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.card,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: THEME.spacing.sm,
  },
  modelIconBox: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelTitleArea: {
    flex: 1,
  },
  modelName: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  modelMeta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  modelDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  modelStatsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: THEME.spacing.md,
  },
  statPill: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  statPillNumber: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  statPillLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  filterRow: {
    marginVertical: THEME.spacing.xs,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: THEME.colors.primaryLight,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginTop: THEME.spacing.sm,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.primaryDark,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 36,
  },
});
