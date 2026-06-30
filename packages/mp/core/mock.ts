/**
 * Mock 数据层 - 符合 @semo/shared 类型
 * 约束：仅 useMock=true 时启用，所有返回值必须满足 shared DTO
 *       模拟网络延迟由 MOCK_DELAY 控制
 */
import { MOCK_DELAY, PAGINATION_CONFIG } from '@/config';
import {
  ERROR_CODE,
  MEAL_TYPE,
  FOOD_CATEGORY,
  USER_STATUS,
  RECORD_STATUS,
  UPLOAD_SCENE,
  type BaseApiResponse,
  type UserLoginRequest,
  type UserLoginResponse,
  type UserItem,
  type UserProfileUpdateRequest,
  type FoodRecognizeRequest,
  type FoodRecognizeResponse,
  type FoodRecognizeItem,
  type RecordItem,
  type RecordCreateRequest,
  type RecordListRequest,
  type DailyStatResponse,
  type DailyStatRequest,
  type PageData,
  type UploadImageResponse,
  type UploadImageRequest,
} from '@semo/shared';
import type { MockHandler, MockRouteKey } from '@/types';

/** Mock 模拟延迟 */
function delay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 包成 BaseApiResponse 成功响应 */
function ok<T>(data: T): BaseApiResponse<T> {
  return {
    code: ERROR_CODE.SUCCESS,
    message: 'OK',
    data,
    traceId: `mock-${Date.now()}`,
    timestamp: Date.now(),
  };
}

// ============ Mock 数据池 ============

const MOCK_USER: UserItem = {
  id: 1001,
  nickname: '测试用户',
  avatar: '',
  gender: 1,
  age: 28,
  height: 175,
  weight: 70,
  targetCalories: 2000,
  status: USER_STATUS.ENABLED,
  createdAt: '2026-06-29T10:00:00.000Z',
  updatedAt: '2026-06-29T10:00:00.000Z',
};

const MOCK_TOKEN = 'mock-jwt-token-for-dev-only';

const MOCK_FOOD_ITEMS: FoodRecognizeItem[] = [
  {
    name: '米饭',
    category: FOOD_CATEGORY.STAPLE,
    weight: 150,
    calories: 174,
    carbs: 38,
    protein: 3,
    fat: 0.5,
    confidence: 0.92,
  },
  {
    name: '西兰花',
    category: FOOD_CATEGORY.VEGETABLE,
    weight: 100,
    calories: 34,
    carbs: 7,
    protein: 2.8,
    fat: 0.4,
    confidence: 0.88,
  },
  {
    name: '鸡胸肉',
    category: FOOD_CATEGORY.MEAT,
    weight: 120,
    calories: 198,
    carbs: 0,
    protein: 37,
    fat: 4.5,
    confidence: 0.95,
  },
];

const MOCK_RECORDS: RecordItem[] = [
  {
    id: 1,
    userId: 1001,
    mealType: MEAL_TYPE.BREAKFAST,
    items: [MOCK_FOOD_ITEMS[0]],
    totalCalories: 174,
    imageUrl: '',
    recordDate: '2026-06-29',
    status: RECORD_STATUS.NORMAL,
    createdAt: '2026-06-29T08:00:00.000Z',
    updatedAt: '2026-06-29T08:00:00.000Z',
  },
  {
    id: 2,
    userId: 1001,
    mealType: MEAL_TYPE.LUNCH,
    items: [MOCK_FOOD_ITEMS[1], MOCK_FOOD_ITEMS[2]],
    totalCalories: 232,
    imageUrl: '',
    recordDate: '2026-06-29',
    status: RECORD_STATUS.NORMAL,
    createdAt: '2026-06-29T12:30:00.000Z',
    updatedAt: '2026-06-29T12:30:00.000Z',
  },
];

// ============ Mock 业务处理器 ============

const mockLogin: MockHandler<UserLoginResponse> = (data) => {
  const req = (data ?? {}) as Partial<UserLoginRequest>;
  void req.code; // 仅占位，mock 不校验 code
  return {
    token: MOCK_TOKEN,
    user: { ...MOCK_USER },
  };
};

const mockGetUserProfile: MockHandler<UserItem> = () => {
  return { ...MOCK_USER };
};

const mockUpdateUserProfile: MockHandler<UserItem> = (data) => {
  const req = (data ?? {}) as Partial<UserProfileUpdateRequest>;
  return { ...MOCK_USER, ...req, updatedAt: new Date().toISOString() };
};

const mockRecognizeFood: MockHandler<FoodRecognizeResponse> = (data) => {
  const req = (data ?? {}) as Partial<FoodRecognizeRequest>;
  void req.image;
  void req.imageType;
  const items = MOCK_FOOD_ITEMS;
  const totalCalories = items.reduce((sum, it) => sum + it.calories, 0);
  return {
    items: items.map((it) => ({ ...it })),
    totalCalories,
    aiTraceId: `mock-ai-${Date.now()}`,
  };
};

const mockRecordList: MockHandler<PageData<RecordItem>> = (data) => {
  const req = (data ?? {}) as Partial<RecordListRequest>;
  const pageNum = req.pageNum ?? 1;
  const pageSize = req.pageSize ?? PAGINATION_CONFIG.defaultPageSize;

  // 日期/餐次筛选
  let filtered = MOCK_RECORDS;
  if (req.startDate) filtered = filtered.filter((r) => r.recordDate >= req.startDate!);
  if (req.endDate) filtered = filtered.filter((r) => r.recordDate <= req.endDate!);
  if (req.mealType != null) filtered = filtered.filter((r) => r.mealType === req.mealType);

  // 分页（mock 数据量小，全量返回当前页）
  const start = (pageNum - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize).map((r) => ({
    ...r,
    items: r.items.map((it) => ({ ...it })),
  }));
  return {
    list,
    total: filtered.length,
    pageNum,
    pageSize,
  };
};

const mockCreateRecord: MockHandler<RecordItem> = (data) => {
  const req = (data ?? {}) as Partial<RecordCreateRequest>;
  const now = new Date().toISOString();
  return {
    id: Math.floor(Math.random() * 10000) + 100,
    userId: MOCK_USER.id,
    mealType: req.mealType ?? MEAL_TYPE.SNACK,
    items: req.items ?? [],
    totalCalories: req.totalCalories ?? 0,
    imageUrl: req.imageUrl ?? '',
    recordDate: req.recordDate ?? new Date().toISOString().slice(0, 10),
    status: RECORD_STATUS.NORMAL,
    createdAt: now,
    updatedAt: now,
  };
};

const mockDailyStat: MockHandler<DailyStatResponse> = (data) => {
  const req = (data ?? {}) as Partial<DailyStatRequest>;
  const targetDate = req.date ?? new Date().toISOString().slice(0, 10);
  const dayRecords = MOCK_RECORDS.filter((r) => r.recordDate === targetDate);
  const totalCalories = dayRecords.reduce((sum, r) => sum + r.totalCalories, 0);
  const mealBreakdown: Record<string, number> = {};
  for (const r of dayRecords) {
    const key = String(r.mealType);
    mealBreakdown[key] = (mealBreakdown[key] ?? 0) + r.totalCalories;
  }
  return {
    recordDate: targetDate,
    totalCalories,
    targetCalories: MOCK_USER.targetCalories ?? 2000,
    recordCount: dayRecords.length,
    mealBreakdown,
  };
};

const mockUploadImage: MockHandler<UploadImageResponse> = (data) => {
  const req = (data ?? {}) as Partial<UploadImageRequest>;
  const scene = req.scene ?? UPLOAD_SCENE.FOOD;
  const filename = req.filename ?? `mock-${scene}-${Date.now()}.jpg`;
  return {
    url: `https://mock-cdn.semo.example.com/${scene}/${filename}`,
    size: Math.floor(Math.random() * 500_000) + 50_000,
    md5: `mock-md5-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
  };
};

// ============ Mock 路由表 ============

const MOCK_ROUTE_MAP: Record<string, MockHandler> = {
  'POST:/user/login': mockLogin as MockHandler,
  'GET:/user/profile': mockGetUserProfile as MockHandler,
  'PUT:/user/profile': mockUpdateUserProfile as MockHandler,
  'POST:/upload/image': mockUploadImage as MockHandler,
  'POST:/food/recognize': mockRecognizeFood as MockHandler,
  'GET:/record/list': mockRecordList as MockHandler,
  'POST:/record': mockCreateRecord as MockHandler,
  'GET:/record/daily-stat': mockDailyStat as MockHandler,
};

/**
 * 查找 mock 处理器
 * @returns 命中则返回 handler，否则 null
 */
export function findMockHandler(route: MockRouteKey): MockHandler | null {
  const key = `${route.method}:${route.url}`;
  return MOCK_ROUTE_MAP[key] ?? null;
}

/**
 * 执行 mock 请求 - 模拟网络延迟 + 包成 BaseApiResponse
 */
export async function executeMock<T>(
  route: MockRouteKey,
  data?: Record<string, unknown>,
): Promise<BaseApiResponse<T>> {
  const handler = findMockHandler(route);
  await delay();
  if (!handler) {
    return {
      code: ERROR_CODE.NOT_FOUND,
      message: 'Mock 路由未注册',
      data: null as unknown as T,
      traceId: `mock-miss-${Date.now()}`,
      timestamp: Date.now(),
    };
  }
  const result = await handler(data);
  return ok<T>(result as T);
}
