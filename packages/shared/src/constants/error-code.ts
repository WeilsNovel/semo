/**
 * 业务错误码枚举 - 前后端共享
 * 约束：服务端抛错必须使用此枚举，禁止硬编码数字
 *       前端异常处理引用 ERROR_MESSAGE_MAP，禁止散落中文文案
 *       新增错误码必须先改 shared，再前后端同步升级
 */
export const ERROR_CODE = {
  /** 成功 */
  SUCCESS: 0,
  /** 参数校验失败 */
  PARAM_INVALID: 40001,
  /** 未登录 */
  UNAUTHORIZED: 40101,
  /** 无权限 */
  FORBIDDEN: 40301,
  /** 资源不存在 */
  NOT_FOUND: 40401,
  /** 服务器错误 */
  SERVER_ERROR: 50001,
  /** 业务限流 */
  RATE_LIMIT: 42901,
  /** AI 识别失败 */
  AI_RECOGNIZE_FAILED: 50011,
  /** AI 调用异常 */
  AI_CALL_ERROR: 50012,
  /** 图片无效（格式不支持/大小超限/损坏） */
  FOOD_IMAGE_INVALID: 40002,
  /** 同餐次重复打卡（可选拦截，由服务端策略决定是否抛出） */
  RECORD_DUPLICATE: 40901,
} as const;

/** 错误码对应文案 - 前端展示用 */
export const ERROR_MESSAGE_MAP: Record<number, string> = {
  [ERROR_CODE.SUCCESS]: '操作成功',
  [ERROR_CODE.PARAM_INVALID]: '参数错误',
  [ERROR_CODE.UNAUTHORIZED]: '请先登录',
  [ERROR_CODE.FORBIDDEN]: '无操作权限',
  [ERROR_CODE.NOT_FOUND]: '资源不存在',
  [ERROR_CODE.SERVER_ERROR]: '服务器异常，请稍后重试',
  [ERROR_CODE.RATE_LIMIT]: '操作过于频繁',
  [ERROR_CODE.AI_RECOGNIZE_FAILED]: '识别失败，请重试或更换照片',
  [ERROR_CODE.AI_CALL_ERROR]: 'AI 服务异常，请稍后重试',
  [ERROR_CODE.FOOD_IMAGE_INVALID]: '图片无效，请重新拍摄',
  [ERROR_CODE.RECORD_DUPLICATE]: '该餐次已打卡，请勿重复',
};
