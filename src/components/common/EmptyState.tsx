import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchX, Inbox } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { CustomButton } from './CustomButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: 'search' | 'inbox';
}

export const EmptyState = ({
  title = 'Không tìm thấy dữ liệu',
  description = 'Không có kết quả nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm của bạn.',
  actionText,
  onActionPress,
  icon = 'search',
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {icon === 'search' ? (
          <SearchX size={32} color={THEME.colors.textSecondary} />
        ) : (
          <Inbox size={32} color={THEME.colors.textSecondary} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionText && onActionPress && (
        <CustomButton
          title={actionText}
          onPress={onActionPress}
          variant="outline"
          size="sm"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xxl,
    paddingHorizontal: THEME.spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  title: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: THEME.spacing.md,
  },
});
