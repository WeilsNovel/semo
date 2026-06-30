/**
 * 全局静态参数（第一层）- 分页/色值/枚举引用/默认文案/尺寸/超时
 * 约束：禁止硬编码，全局变更仅改此文件自动同步
 */
import { MEAL_TYPE, FOOD_CATEGORY } from '@semo/shared';

/** 分页配置 */
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

/** 主题色配置 */
export const THEME_COLOR_CONFIG = {
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  danger: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textPlaceholder: '#999999',
  bgPage: '#F5F6F8',
  bgCard: '#FFFFFF',
  divider: '#EEEEEE',
} as const;

/** 默认文案 */
export const DEFAULT_TEXT_CONFIG = {
  appName: 'semo',
  loading: '加载中...',
  empty: '暂无数据',
  networkError: '网络异常，请稍后重试',
  confirm: '确定',
  cancel: '取消',
  save: '保存',
  delete: '删除',
} as const;

/** 弹窗/卡片尺寸（rpx） */
export const SIZE_CONFIG = {
  cardRadius: 16,
  buttonRadius: 24,
  pagePadding: 32,
  cardPadding: 24,
} as const;

/** 请求超时（ms） */
export const REQUEST_TIMEOUT = 15000;

/** Mock 模拟网络延迟（ms） - 仅 useMock=true 时生效 */
export const MOCK_DELAY = 300;

/** 餐次文案映射 */
export const MEAL_TYPE_TEXT_MAP: Record<number, string> = {
  [MEAL_TYPE.BREAKFAST]: '早餐',
  [MEAL_TYPE.LUNCH]: '午餐',
  [MEAL_TYPE.DINNER]: '晚餐',
  [MEAL_TYPE.SNACK]: '加餐',
};

/** 食物分类文案映射 */
export const FOOD_CATEGORY_TEXT_MAP: Record<number, string> = {
  [FOOD_CATEGORY.STAPLE]: '主食',
  [FOOD_CATEGORY.MEAT]: '肉类',
  [FOOD_CATEGORY.VEGETABLE]: '蔬菜',
  [FOOD_CATEGORY.FRUIT]: '水果',
  [FOOD_CATEGORY.DAIRY]: '乳制品',
  [FOOD_CATEGORY.BEVERAGE]: '饮料',
  [FOOD_CATEGORY.OTHER]: '其他',
};

/** tabBar 页面路径 */
export const TAB_BAR_LIST = [
  { pagePath: 'pages/record/index', text: '打卡', iconPath: 'static/tab/record.png', selectedIconPath: 'static/tab/record-active.png' },
  { pagePath: 'pages/stats/index', text: '统计', iconPath: 'static/tab/stats.png', selectedIconPath: 'static/tab/stats-active.png' },
  { pagePath: 'pages/plan/index', text: '计划', iconPath: 'static/tab/plan.png', selectedIconPath: 'static/tab/plan-active.png' },
  { pagePath: 'pages/mine/index', text: '我的', iconPath: 'static/tab/mine.png', selectedIconPath: 'static/tab/mine-active.png' },
] as const;

/** 页面路径集中映射 - uni.navigateTo / switchTab 统一引用，禁止散落字符串 */
export const PAGE_PATH_MAP = {
  record: '/pages/record/index',
  stats: '/pages/stats/index',
  plan: '/pages/plan/index',
  mine: '/pages/mine/index',
} as const;
