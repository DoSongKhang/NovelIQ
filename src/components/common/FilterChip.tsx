import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
}

export const FilterChip = ({
  label,
  selected,
  onPress,
  count,
}: FilterChipProps) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
      {count !== undefined && (
        <Text style={[styles.count, selected && styles.countSelected]}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: THEME.spacing.xs,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  label: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.weights.semibold,
  },
  count: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textMuted,
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#FFFFFF',
  },
});
