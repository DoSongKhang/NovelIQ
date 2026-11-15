import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  Settings,
  Bell,
  Moon,
  Database,
  Terminal,
  Activity,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
  Layers,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CustomButton } from '../../components/common/CustomButton';
import { MOCK_SCRAPING_STATUS } from '../../mock-data/mockData';
import { THEME } from '../../constants/theme';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCrawlerRunning, setIsCrawlerRunning] = useState(true);

  const status = MOCK_SCRAPING_STATUS;

  const handleCrawlerToggle = () => {
    setIsCrawlerRunning(!isCrawlerRunning);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Hồ Sơ & Hệ Thống"
        subtitle="Quản trị thiết lập & bảng điều khiển Crawler"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>Data Intelligence Lead</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>lead-analyst@tiki-intelligence.internal</Text>
            <Text style={styles.userOrg}>Bộ phận: Price Intelligence & ML Labs</Text>
          </View>
        </View>

        {/* ADMIN SECTION: SCRAPING & PIPELINE STATUS */}
        <View style={styles.adminSectionHeader}>
          <View style={styles.adminTag}>
            <Shield size={12} color={THEME.colors.primary} />
            <Text style={styles.adminTagText}>BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN</Text>
          </View>
        </View>

        <View style={styles.adminCard}>
          <View style={styles.adminStatusHeader}>
            <View style={styles.statusLiveGroup}>
              <View
                style={[
                  styles.statusIndicatorDot,
                  {
                    backgroundColor: isCrawlerRunning
                      ? THEME.colors.success
                      : THEME.colors.textMuted,
                  },
                ]}
              />
              <Text style={styles.statusHeading}>
                Crawler Worker: {isCrawlerRunning ? 'RUNNING (Đang chạy)' : 'PAUSED (Đã tạm dừng)'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.toggleCrawlerBtn}
              onPress={handleCrawlerToggle}
            >
              <Text style={styles.toggleCrawlerText}>
                {isCrawlerRunning ? 'Tạm dừng' : 'Kích hoạt'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Crawler Metrics Grid */}
          <View style={styles.crawlerGrid}>
            <View style={styles.crawlerGridItem}>
              <Text style={styles.gridVal}>{status.totalCollectedToday.toLocaleString()}</Text>
              <Text style={styles.gridLabel}>SKU Cào Hôm Nay</Text>
            </View>

            <View style={styles.crawlerGridItem}>
              <Text style={styles.gridVal}>{status.totalCollectedAllTime.toLocaleString()}</Text>
              <Text style={styles.gridLabel}>Tổng SKU Lưu Trữ</Text>
            </View>

            <View style={styles.crawlerGridItem}>
              <Text style={[styles.gridVal, { color: THEME.colors.success }]}>
                {status.successRate}%
              </Text>
              <Text style={styles.gridLabel}>Tỷ Lệ Thành Công</Text>
            </View>

            <View style={styles.crawlerGridItem}>
              <Text style={styles.gridVal}>{status.syncStatus}</Text>
              <Text style={styles.gridLabel}>Đồng Bộ SQLite/CSV</Text>
            </View>
          </View>

          {/* Current Job & Last Run */}
          <View style={styles.jobInfoBox}>
            <View style={styles.jobRow}>
              <Clock size={13} color={THEME.colors.textSecondary} />
              <Text style={styles.jobText}>
                Lần cào cuối: <Text style={styles.boldText}>{status.lastScrapedTime}</Text>
              </Text>
            </View>
            <View style={styles.jobRow}>
              <Terminal size={13} color={THEME.colors.textSecondary} />
              <Text style={styles.jobText} numberOfLines={1}>
                Tiến trình: <Text style={styles.boldText}>{status.currentJobName}</Text>
              </Text>
            </View>
          </View>

          {/* Recent Scraping Terminal Logs */}
          <Text style={styles.terminalTitle}>Nhật Ký Thực Thi Gần Nhất (Live Logs)</Text>
          <View style={styles.terminalBox}>
            {status.recentLogs.map((log) => (
              <View key={log.id} style={styles.terminalLogRow}>
                <Text style={styles.logTime}>[{log.time}]</Text>
                <Text
                  style={[
                    styles.logMsg,
                    log.level === 'warn' && styles.logWarn,
                    log.level === 'success' && styles.logSuccess,
                  ]}
                >
                  {log.message}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* General App Settings */}
        <SectionHeader title="Cài Đặt Ứng Dụng" />
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={18} color={THEME.colors.textSecondary} />
              <Text style={styles.settingLabel}>Cảnh Báo Biến Động Giá</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <RefreshCw size={18} color={THEME.colors.textSecondary} />
              <Text style={styles.settingLabel}>Tự Động Làm Mới Khi Vào App</Text>
            </View>
            <Switch
              value={autoSyncEnabled}
              onValueChange={setAutoSyncEnabled}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Moon size={18} color={THEME.colors.textSecondary} />
              <Text style={styles.settingLabel}>Chế Độ Tối (Giao diện chuẩn: Light Mode)</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
            />
          </View>
        </View>

        {/* Data Source & Info */}
        <SectionHeader title="Thông Tin Nguồn Dữ Liệu" />
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Database size={18} color={THEME.colors.textSecondary} />
              <View>
                <Text style={styles.settingLabel}>Tiki Vietnam Public Endpoints</Text>
                <Text style={styles.settingSub}>API v2 / categories / parent_id=839</Text>
              </View>
            </View>
            <ChevronRight size={16} color={THEME.colors.textMuted} />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Layers size={18} color={THEME.colors.textSecondary} />
              <View>
                <Text style={styles.settingLabel}>Phiên bản Frontend</Text>
                <Text style={styles.settingSub}>v1.0.0 SaaS Mobile Edition</Text>
              </View>
            </View>
            <Text style={styles.versionBadge}>Stable</Text>
          </View>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Đăng Xuất Phiên Làm Việc"
          variant="outline"
          size="md"
          icon={<LogOut size={16} color={THEME.colors.danger} />}
          onPress={() => {
            Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất không?');
          }}
          textStyle={{ color: THEME.colors.danger }}
          style={styles.logoutBtn}
        />

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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.base,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.base,
    ...THEME.shadows.card,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  roleBadge: {
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
  },
  userEmail: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  userOrg: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  adminSectionHeader: {
    marginBottom: THEME.spacing.sm,
    marginTop: THEME.spacing.sm,
  },
  adminTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminTagText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
    letterSpacing: 0.5,
  },
  adminCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.base,
    ...THEME.shadows.card,
  },
  adminStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
    marginBottom: THEME.spacing.md,
  },
  statusLiveGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusHeading: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  toggleCrawlerBtn: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  toggleCrawlerText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
  },
  crawlerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  crawlerGridItem: {
    width: '48%',
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  gridVal: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  gridLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  jobInfoBox: {
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
    marginBottom: THEME.spacing.md,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  boldText: {
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  terminalTitle: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  terminalBox: {
    backgroundColor: '#0F172A',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    gap: 6,
  },
  terminalLogRow: {
    flexDirection: 'row',
    gap: 6,
  },
  logTime: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#64748B',
  },
  logMsg: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#E2E8F0',
    flex: 1,
  },
  logWarn: {
    color: '#FBBF24',
  },
  logSuccess: {
    color: '#34D399',
  },
  settingsGroup: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    ...THEME.shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginLeft: 44,
  },
  versionBadge: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logoutBtn: {
    marginTop: THEME.spacing.sm,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  bottomSpacer: {
    height: 40,
  },
});
