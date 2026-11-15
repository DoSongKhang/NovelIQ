import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';
import { THEME } from '../../constants/theme';

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: 'crawler' | 'price_alert' | 'sync';
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    time: '5 phút trước',
    title: 'Đồng bộ 120 SKU Sách Tiếng Việt',
    detail: 'Crawler hoàn tất cập nhật bảng giá từ Tiki API parent_id=839.',
    type: 'crawler',
  },
  {
    id: 'act-2',
    time: '24 phút trước',
    title: 'Phát hiện giảm giá đáy: Keychron K2 Pro',
    detail: 'Mức giá chạm mốc 2.150.000₫ (giảm 15%), lập đáy mới 90 ngày.',
    type: 'price_alert',
  },
  {
    id: 'act-3',
    time: '1 giờ trước',
    title: 'Tự động kiểm tra tính nhất quán dữ liệu',
    detail: 'Xác thực 48.920 bản ghi giá không có xung đột schema.',
    type: 'sync',
  },
];

export const RecentActivityFeed = ({
  items = DEFAULT_ACTIVITIES,
}: { items?: ActivityItem[] }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        return (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.iconCol}>
              {item.type === 'crawler' ? (
                <View style={[styles.iconBox, { backgroundColor: THEME.colors.primaryLight }]}>
                  <Clock size={14} color={THEME.colors.primary} />
                </View>
              ) : item.type === 'price_alert' ? (
                <View style={[styles.iconBox, { backgroundColor: THEME.colors.warningLight }]}>
                  <AlertTriangle size={14} color={THEME.colors.warning} />
                </View>
              ) : (
                <View style={[styles.iconBox, { backgroundColor: THEME.colors.successLight }]}>
                  <CheckCircle2 size={14} color={THEME.colors.success} />
                </View>
              )}
              {index !== items.length - 1 && <View style={styles.verticalLine} />}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.topRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
  },
  iconCol: {
    alignItems: 'center',
    width: 28,
    marginRight: THEME.spacing.sm,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: THEME.colors.borderLight,
    marginTop: 4,
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  itemTime: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  itemDetail: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
});
