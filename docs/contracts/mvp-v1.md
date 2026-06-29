# semo MVP v1 接口契约

> 适用范围：MVP 第一波（微信登录 + 拍照识别 + 落库打卡 + 当日统计）
> 单一事实来源：`packages/shared/src/types`、`packages/shared/src/constants`
> 所有响应统一包裹 `BaseApiResponse<T>`，下文「响应」字段指 `T` 的结构。

## 一、通用约定
- 基础路径：由 `packages/mp` 的 env 配置（dev/prod 不同），服务端在 `packages/server` 的 config 注册全局前缀
- 鉴权：除 `POST /user/login` 外，所有接口需 `Authorization: Bearer <token>`
- 响应结构：`{ code, message, data, traceId?, timestamp? }`
- 成功：`code === 0`；失败：`code !== 0`，前端引用 `ERROR_MESSAGE_MAP` 展示文案
- 字段命名：统一 camelCase
- 时间字段：`createdAt`/`updatedAt`/`recordDate` 均为字符串（`recordDate` 为 `YYYY-MM-DD`，其余为 ISO 时间字符串）

## 二、错误码（本波新增）
| code | 常量 | 含义 | 触发场景 |
|---|---|---|---|
| 40002 | `FOOD_IMAGE_INVALID` | 图片无效 | 上传/识别时图片格式不支持、大小超限或损坏 |
| 40901 | `RECORD_DUPLICATE` | 同餐次重复打卡 | 同一用户同一日期同一餐次已有记录（可选拦截，由服务端策略决定） |

完整错误码见 `packages/shared/src/constants/error-code.ts`。

## 三、接口清单

### 1. 用户登录
- **方法路径**：`POST /user/login`
- **鉴权**：无
- **请求**：`UserLoginRequest`
  ```json
  { "code": "wx.login 返回的 code" }
  ```
- **响应**：`UserLoginResponse`
  ```json
  { "token": "jwt", "user": UserItem }
  ```
- **错误码**：`PARAM_INVALID`（code 缺失）、`SERVER_ERROR`

### 2. 获取用户档案
- **方法路径**：`GET /user/profile`
- **鉴权**：是
- **请求**：无
- **响应**：`UserItem`
- **错误码**：`UNAUTHORIZED`、`NOT_FOUND`

### 3. 更新用户档案
- **方法路径**：`PUT /user/profile`
- **鉴权**：是
- **请求**：`UserProfileUpdateRequest`（所有字段可选）
  ```json
  { "nickname": "小明", "gender": 1, "age": 28, "height": 175, "weight": 70, "targetCalories": 2000, "avatar": "https://..." }
  ```
- **响应**：`UserItem`（更新后的完整档案）
- **错误码**：`PARAM_INVALID`、`UNAUTHORIZED`

### 4. 图片上传
- **方法路径**：`POST /upload/image`
- **鉴权**：是
- **Content-Type**：`multipart/form-data`
- **请求**：`UploadImageRequest`（multipart 字段）
  | 字段 | 类型 | 必填 | 说明 |
  |---|---|---|---|
  | file | binary | 是 | 图片二进制（支持 jpeg/png） |
  | scene | string | 是 | `'food'` 打卡图 / `'avatar'` 头像（引用 `UPLOAD_SCENE`） |
  | filename | string | 否 | 文件名（用于服务端命名/日志） |
- **响应**：`UploadImageResponse`
  ```json
  { "url": "https://cdn.example.com/xxx.jpg", "size": 123456, "md5": "..." }
  ```
- **错误码**：`FOOD_IMAGE_INVALID`、`PARAM_INVALID`、`UNAUTHORIZED`
- **后续衔接**：返回的 `url` 用于 `POST /food/recognize` 的 `image` 字段（`imageType: 'url'`）或 `PUT /user/profile` 的 `avatar`

### 5. 食物识别
- **方法路径**：`POST /food/recognize`
- **鉴权**：是
- **Content-Type**：`application/json`
- **请求**：`FoodRecognizeRequest`
  ```json
  { "image": "https://cdn.example.com/xxx.jpg", "imageType": "url", "mealType": 1 }
  ```
  - `image`：base64（不含 `data:` 前缀）或图片 URL
  - `imageType`：`'base64' | 'url'`
  - `mealType`：可选，传给 AI 作为分量判断上下文（引用 `MEAL_TYPE`）
- **响应**：`FoodRecognizeResponse`
  ```json
  { "items": [FoodRecognizeItem], "totalCalories": 0, "aiTraceId": "..." }
  ```
- **设计决策**：本接口**仅识别，不落库**。前端拿到结果后由用户确认，再调 `POST /record` 创建打卡。理由：分离识别与落库，允许用户编辑识别结果后再保存，避免取消时产生孤儿记录。
- **错误码**：`AI_RECOGNIZE_FAILED`、`AI_CALL_ERROR`、`FOOD_IMAGE_INVALID`、`UNAUTHORIZED`

### 6. 创建打卡记录
- **方法路径**：`POST /record`
- **鉴权**：是
- **请求**：`RecordCreateRequest`
  ```json
  { "mealType": 1, "items": [FoodRecognizeItem], "totalCalories": 0, "imageUrl": "https://...", "recordDate": "2026-06-29" }
  ```
- **响应**：`RecordItem`（含服务端生成的 `id`、`createdAt`、`updatedAt`、`status`）
- **错误码**：`PARAM_INVALID`、`RECORD_DUPLICATE`（可选）、`UNAUTHORIZED`

### 7. 打卡记录列表
- **方法路径**：`GET /record/list`
- **鉴权**：是
- **请求**：`RecordListRequest`（query 参数，extends `PageQuery`）
  | 字段 | 类型 | 必填 | 说明 |
  |---|---|---|---|
  | pageNum | number | 是 | 页码，从 1 开始 |
  | pageSize | number | 是 | 每页条数 |
  | startDate | string | 否 | 起始日期 `YYYY-MM-DD` |
  | endDate | string | 否 | 结束日期 `YYYY-MM-DD` |
  | mealType | number | 否 | 餐次筛选（引用 `MEAL_TYPE`） |
- **响应**：`PageData<RecordItem>`
  ```json
  { "list": [RecordItem], "total": 0, "pageNum": 1, "pageSize": 20 }
  ```
- **错误码**：`PARAM_INVALID`、`UNAUTHORIZED`

### 8. 当日统计
- **方法路径**：`GET /record/daily-stat`
- **鉴权**：是
- **请求**：`DailyStatRequest`（query 参数）
  | 字段 | 类型 | 必填 | 说明 |
  |---|---|---|---|
  | date | string | 否 | 查询日期 `YYYY-MM-DD`，默认当日（服务端兜底） |
- **响应**：`DailyStatResponse`
  ```json
  { "recordDate": "2026-06-29", "totalCalories": 0, "targetCalories": 2000, "recordCount": 3, "mealBreakdown": { "1": 0, "2": 0, "3": 0, "4": 0 } }
  ```
  - `mealBreakdown` 的 key 为 `MEAL_TYPE` 数值字符串，value 为该餐热量
- **错误码**：`PARAM_INVALID`、`UNAUTHORIZED`

## 四、MVP 调用流程
```
1. wx.login → POST /user/login → 持久化 token
2. 拍照 → POST /upload/image (scene=food) → 拿 url
3. POST /food/recognize { image: url, imageType: 'url', mealType } → 拿 items + totalCalories
4. （用户确认/编辑识别结果）→ POST /record → 落库，拿 recordId
5. GET /record/daily-stat → 当日统计展示
```

## 五、跨端协同要点
- **前端（packages/mp）**：
  - api 层引用 shared 类型（`UserLoginRequest`、`FoodRecognizeRequest`、`RecordCreateRequest`、`UploadImageRequest` 等），禁止单独定义
  - `core/mock.ts` 按 shared 类型造 mock 数据
  - 异常处理引用 `ERROR_MESSAGE_MAP`，禁止散落中文文案
  - 上传走 multipart，识别走 JSON
- **服务端（packages/server）**：
  - DTO 引用 shared，全局响应拦截器输出 `BaseApiResponse<T>`
  - `/upload/image` 用 `@UseInterceptors(FileInterceptor)` 处理 multipart
  - `/food/recognize` 调用 `packages/server/src/ai` 运行时，模板来自 `@semo/ai`
  - `/record` 落库时校验同餐次重复（可选抛 `RECORD_DUPLICATE`）
  - 错误码用 `ERROR_CODE` 枚举，禁止硬编码数字
- **AI 设计层（packages/ai）**：本波无需新增 Prompt 模板，`recognize-food` / `generate-plan` 已就位

## 六、未覆盖项（后续迭代）
- 计划生成 `POST /plan/generate`（`PlanGenerateRequest/Response` 已就位，MVP 不接入）
- 计划列表/详情查询
- 用户注销/退出登录
- 文件删除接口
