import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock } from 'lucide-react-native';
import { CollectionHistoryRecord } from '../../types';
import { THEME } from '../../constants/theme';

interface CollectionHistoryListProps {
  records: CollectionHistoryRecord[];
}

export const CollectionHistoryList = ({ records }: CollectionHistoryListProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Lịch Sử Thu Thập Dữ Liệu (Crawl Log)</Text>

      {records.map((rec, index) => {
        return (
          <View
            key={rec.id}
            style={[
              styles.recordRow,
              index !== records.length - 1 && styles.borderBottom,
            ]}
          >
            <View style={styles.leftCol}>
              <View style={styles.iconBox}>
                <CheckCircle2 size={14} color={THEME.colors.success} />
              </View>
              <View>
                <Text style={styles.timestamp}>{rec.timestamp}</Text>
                <Text style={styles.statusText}>
                  Trạng thái: OK • Tồn kho: {rec.inStock ? 'Còn hàng' : 'Hết hàng'}
                </Text>
              </View>
            </View>

            <View style={styles.rightCol}>
              <Text style={styles.priceSnap}>
                {rec.priceSnapshot.toLocaleString('vi-VN')}₫
              </Text>
              {rec.discountSnapshot > 0 && (
                <Text style={styles.discountSnap}>-{rec.discountSnapshot}%</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.base,
    ...THEME.shadows.card,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  statusText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  priceSnap: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  discountSnap: {
    fontSize: 10,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weights.semibold,
  },
});
