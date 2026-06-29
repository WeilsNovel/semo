# semo 多端协作规范（整合对话守护）

> 本文档定义三对话与整合对话的协作铁律。所有对话新会话开始时必读。

## 一、角色
- **整合对话**（本对话）：跨端协调、shared 变更评审、决策记录、分支守护、联调校验、技术债跟踪
- **前端对话**：`packages/mp` 全部代码
- **服务端对话**：`packages/server` 全部代码（含 `src/ai` 运行时）
- **API 对话**：`packages/shared` + `packages/ai`（契约 + AI Prompt 设计，不写业务运行时代码）

## 二、shared 变更流程（最易乱，强制走这条）
```
需求涉及接口/DTO/错误码/枚举
  → 整合对话拆解，派给 API 对话
  → API 对话产出 shared 变更（feature/contract-xxx 分支）
  → 整合对话评审 + 输出「跨端协同变更清单」
  → 通知前端对话：在 shared 引用层同步（feature/fe-xxx）
  → 通知服务端对话：DTO 同步 + 业务实现（feature/server-xxx）
  → 三处同一次合并窗口，联调校验字段一致性
```

## 三、分支策略
- `main`：可发布稳定版，受保护
- `develop`：集成分支，三端 PR 汇入此
- `feature/fe-xxx`：前端功能（仅改 `packages/mp`）
- `feature/server-xxx`：服务端功能（仅改 `packages/server`）
- `feature/contract-xxx`：契约变更（仅改 `packages/shared` + `packages/ai`）
- `fix/fe-xxx` / `fix/server-xxx` / `fix/contract-xxx`：修复
- **铁律**：跨包改动必须拆成多个分支顺序合并，禁止一个分支跨包

## 四、提交规范
Conventional Commits，scope 强制：
- `feat(mp):` 前端
- `feat(server):` 服务端
- `feat(shared):` 契约
- `feat(ai):` AI Prompt/配置
- `docs(contract):` 接口契约文档
- `fix(mp/server/shared/ai):` 修复
- 提交前自查硬编码（见 skill 04 清单）

## 五、联调流程（套用 skill 11.5）
1. 契约先行（API 对话在 shared 定义 DTO）
2. 服务端实现（NestJS，DTO 引用 shared）
3. 前端 Mock（core/mock.ts 符合 shared 类型）
4. 前端开发（api 引用 shared 类型）
5. env.useMock 切换 mock/真实接口
6. 契约校验（对照 shared 校验实际响应字段）

## 六、AI 调用安全铁律
- API Key 仅 `packages/server/.env`，从 process.env 读取，禁止硬编码
- 前端禁直连 AI 供应商，必须经 server REST 转发
- `packages/ai` 永不放真实 Key，仅放占位模板
- AI Prompt 模板参数化，变量用占位符，不硬编码用户数据

## 七、硬编码自查清单（每次提交前必扫）
- [ ] 魔法数字 → constants
- [ ] 硬编码色值 → THEME_COLOR_CONFIG
- [ ] 硬编码文案 → DEFAULT_TEXT_CONFIG 或页面 params
- [ ] 硬编码尺寸/路径/域名/超时 → 对应参数层
- [ ] 缺失类型（any）→ 补全 TS 类型
- [ ] 零散 props → 改为统一 params 对象
- [ ] 错误码数字 → ERROR_CODE 枚举
- [ ] 业务状态值 → business.ts 枚举

## 八、跨端协同自查清单（每次跨端修改后必执行）
- [ ] shared/types 是否已定义对应 DTO
- [ ] 服务端 DTO 字段是否与 shared 完全一致
- [ ] 前端 api 是否引用 shared 类型（未单独定义）
- [ ] 新增错误码是否在 shared/constants/error-code.ts 注册
- [ ] 业务状态值是否在 shared/constants/business.ts 注册
- [ ] 前端异常处理是否引用 ERROR_MESSAGE_MAP
- [ ] Mock 数据是否符合 shared 类型定义
- [ ] env.ts 的 useMock 开关是否按环境正确配置
- [ ] 是否输出「跨端协同变更清单」
