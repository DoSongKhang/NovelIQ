export interface PriceHistoryPoint {
  date: string;
  price: number;
  originalPrice?: number;
}

export interface CollectionHistoryRecord {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  priceSnapshot: number;
  discountSnapshot: number;
  inStock: boolean;
}

export interface ProductPriceStatistics {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  currentPrice: number;
  discountRate: number;
  allTimeLowest: boolean;
  volatilityRate: number; // e.g. 4.2%
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryId: number;
  currentPrice: number;
  originalPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  storeName: string;
  storeId: string;
  isOfficialStore: boolean;
  imageUrl: string;
  description: string;
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  historicalPrices: PriceHistoryPoint[];
  statistics: ProductPriceStatistics;
  collectionHistory: CollectionHistoryRecord[];
}

export interface CategorySummary {
  id: number;
  name: string;
  productCount: number;
  avgPrice: number;
  growthRate: number; // percentage
  iconName?: string;
}

export interface DashboardKPISummary {
  totalProducts: number;
  totalProductsGrowth: number;
  totalCategories: number;
  totalCategoriesGrowth: number;
  avgPrice: number;
  avgPriceChange: number;
  totalStores: number;
  totalStoresGrowth: number;
}

export interface CollectionActivityPoint {
  timeLabel: string;
  collectedCount: number;
  errorCount: number;
}

export interface PriceDistributionBracket {
  rangeLabel: string;
  count: number;
  percentage: number;
}

export interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  relatedCategory: string;
  relatedProductId?: string;
  confidenceScore: number; // 0 to 100
  type: 'prediction' | 'anomaly' | 'clustering' | 'trend';
  severity?: 'high' | 'medium' | 'info';
  lastUpdated: string;
  predictedDirection?: 'up' | 'down' | 'stable';
  projectedChangePercent?: number;
}

export interface ScrapingAdminStatus {
  serviceStatus: 'RUNNING' | 'IDLE' | 'COMPLETED' | 'PAUSED' | 'FAILED';
  lastScrapedTime: string;
  totalCollectedToday: number;
  totalCollectedAllTime: number;
  successRate: number;
  syncStatus: 'SYNCED' | 'SYNCING' | 'PENDING';
  currentJobName: string;
  queueLength: number;
  recentLogs: {
    id: string;
    time: string;
    message: string;
    level: 'info' | 'warn' | 'success';
  }[];
}
