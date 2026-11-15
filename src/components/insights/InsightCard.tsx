import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, Layers } from 'lucide-react-native';
import { AIInsightItem } from '../../types';
import { THEME } from '../../constants/theme';

interface InsightCardProps {
  insight: AIInsightItem;
}

export const InsightCard = ({ insight }: InsightCardProps) => {
  const getTypeColor = () => {
    switch (insight.type) {
      case 'anomaly':
        return THEME.colors.danger;
      case 'prediction':
        return THEME.colors.primary;
      case 'clustering':
        return THEME.colors.chartIndigo;
      default:
        return THEME.colors.chartEmerald;
    }
  };

  const getTypeLabel = () => {
    switch (insight.type) {
      case 'anomaly':
        return 'Phát hiện dị thường';
      case 'prediction':
        return 'Dự báo học máy';
      case 'clustering':
        return 'Phân cụm K-Means';
      default:
        return 'Xu hướng thị trường';
    }
  };

  const renderIcon = () => {
    switch (insight.type) {
      case 'anomaly':
        return <AlertTriangle size={16} color={THEME.colors.danger} />;
      case 'clustering':
        return <Layers size={16} color={THEME.colors.chartIndigo} />;
      default:
        return <Sparkles size={16} color={THEME.colors.primary} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor()}15` }]}>
            {renderIcon()}
            <Text style={[styles.typeText, { color: getTypeColor() }]}>
              {getTypeLabel()}
            </Text>
          </View>

          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceLabel}>Độ tin cậy</Text>
            <Text style={styles.confidenceValue}>{insight.confidenceScore}%</Text>
          </View>
        </View>

        <Text style={styles.title}>{insight.title}</Text>
      </View>

      <Text style={styles.description}>{insight.description}</Text>

      <View style={styles.footer}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{insight.relatedCategory}</Text>
        </View>

        <View style={styles.footerRight}>
          {insight.projectedChangePercent !== undefined && (
            <View
              style={[
                styles.changeTag,
                insight.projectedChangePercent < 0
                  ? styles.changeTagDown
                  : styles.changeTagUp,
              ]}
            >
              {insight.projectedChangePercent < 0 ? (
                <TrendingDown size={12} color={THEME.colors.danger} />
              ) : (
                <TrendingUp size={12} color={THEME.colors.success} />
              )}
              <Text
                style={[
                  styles.changeTagText,
                  {
                    color:
                      insight.projectedChangePercent < 0
                        ? THEME.colors.danger
                        : THEME.colors.success,
                  },
                ]}
              >
                {insight.projectedChangePercent > 0
                  ? `+${insight.projectedChangePercent}%`
                  : `${insight.projectedChangePercent}%`}
              </Text>
            </View>
          )}
          <Text style={styles.timestamp}>{insight.lastUpdated}</Text>
        </View>
      </View>
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
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.card,
  },
  header: {
    marginBottom: THEME.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  typeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.xs,
  },
  confidenceLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  confidenceValue: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  title: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    lineHeight: 22,
  },
  description: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
  },
  categoryPill: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
    maxWidth: '55%',
  },
  categoryText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.xs,
  },
  changeTagDown: {
    backgroundColor: THEME.colors.dangerLight,
  },
  changeTagUp: {
    backgroundColor: THEME.colors.successLight,
  },
  changeTagText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
  },
  timestamp: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
});
