/**
 * 组件层类型 + DEFAULT 兜底（第三层参数）
 * 约束：所有基础组件挂载 params 对象渲染，禁止裸 props 散落
 *       色值/文案/尺寸由 config 注入，组件内部不硬编码
 */
import { THEME_COLOR_CONFIG, DEFAULT_TEXT_CONFIG, SIZE_CONFIG } from '@/config';

/** 按钮类型 */
export type ButtonType = 'primary' | 'danger' | 'warning' | 'info' | 'default';
/** 按钮尺寸 */
export type ButtonSize = 'small' | 'medium' | 'large';

/** BaseButton 参数 */
export interface BaseButtonParams {
  text: string;
  type: ButtonType;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
  block: boolean;
}

export const DEFAULT_BUTTON_PARAMS: BaseButtonParams = {
  text: DEFAULT_TEXT_CONFIG.confirm,
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
};

/** BaseCard 参数 */
export interface BaseCardParams {
  title?: string;
  padding: number;
  radius: number;
  showDivider: boolean;
}

export const DEFAULT_CARD_PARAMS: BaseCardParams = {
  padding: SIZE_CONFIG.cardPadding,
  radius: SIZE_CONFIG.cardRadius,
  showDivider: false,
};

/** 空状态参数 */
export interface EmptyStateParams {
  text: string;
  icon: string;
}

export const DEFAULT_EMPTY_PARAMS: EmptyStateParams = {
  text: DEFAULT_TEXT_CONFIG.empty,
  icon: '📋',
};

/** 区段标题参数 */
export interface SectionTitleParams {
  text: string;
  showAll?: boolean;
  allText?: string;
}

export const DEFAULT_SECTION_TITLE_PARAMS: SectionTitleParams = {
  text: '',
  showAll: false,
  allText: '全部',
};

/** 统计卡片参数 */
export interface StatCardParams {
  label: string;
  value: string;
  unit: string;
  /** 进度 0-1，用于环形展示 */
  progress: number;
  /** 主色覆盖（默认主题色） */
  color?: string;
}

export const DEFAULT_STAT_CARD_PARAMS: StatCardParams = {
  label: '',
  value: '0',
  unit: '',
  progress: 0,
  color: THEME_COLOR_CONFIG.primary,
};

/** 食物项展示参数 */
export interface FoodItemCardParams {
  name: string;
  categoryText: string;
  weight: number;
  calories: number;
  confidence: number;
}

export const DEFAULT_FOOD_ITEM_PARAMS: FoodItemCardParams = {
  name: '',
  categoryText: '',
  weight: 0,
  calories: 0,
  confidence: 0,
};

/** 用户档案展示参数 */
export interface UserProfileCardParams {
  nickname: string;
  avatar: string;
  genderText: string;
  ageText: string;
  heightWeightText: string;
  targetCaloriesText: string;
}

export const DEFAULT_USER_PROFILE_PARAMS: UserProfileCardParams = {
  nickname: DEFAULT_TEXT_CONFIG.appName,
  avatar: '',
  genderText: '未知',
  ageText: '-',
  heightWeightText: '-',
  targetCaloriesText: '-',
};

/** Tab 项参数（用于非 tabBar 的内嵌 tab） */
export interface TabItemParams {
  key: string | number;
  text: string;
}

/** 主题色映射（供组件按 type 取色） */
export const BUTTON_COLOR_MAP: Record<ButtonType, string> = {
  primary: THEME_COLOR_CONFIG.primary,
  danger: THEME_COLOR_CONFIG.danger,
  warning: THEME_COLOR_CONFIG.warning,
  info: THEME_COLOR_CONFIG.info,
  default: THEME_COLOR_CONFIG.bgCard,
};
