# semo 关键技术决策记录

> 每条决策记录：日期 / 决策 / 背景 / 替代方案 / 影响。仅记录不可轻易回退的关键决策。

## D001 项目代号与定位
- 日期：2026-06-29
- 决策：项目代号 `semo`，定位为「健康AI拍照识别 + 记录 + 打卡」小程序
- 背景：全新项目，无历史包袱
- 影响：所有包名、分支前缀、文档目录统一以 `semo` 为根

## D002 前端技术栈 = Uni-app (Vue3 + TS)
- 日期：2026-06-29
- 决策：小程序前端采用 Uni-app + Vue3 + TypeScript
- 替代方案：Taro / 原生微信小程序 / 抖音小程序
- 理由：一套代码可多端编译，Vue3 与 TS 生态成熟，贴合 shared 类型共享
- 影响：`packages/mp` 套用 Uni-app 架构（rpx、条件编译、tabBar 参数化）

## D003 服务端框架 = NestJS
- 日期：2026-06-29
- 决策：服务端采用 NestJS + TypeScript
- 替代方案：Express / Fastify / Go
- 理由：装饰器 + 内置校验/拦截器，最契合多端协同的 shared 类型契约
- 影响：`packages/server` 套用 NestJS 架构，全局响应拦截器输出 BaseApiResponse

## D004 仓库结构 = Monorepo (pnpm workspace)
- 日期：2026-06-29
- 决策：三端 + shared + ai 统一在单仓 `semo`，使用 pnpm workspace
- 替代方案：三仓 + npm 私有包 / git submodule
- 理由：shared 作为内部包直接引用，三端同步成本最低
- 影响：`pnpm-workspace.yaml` 仅声明 `packages/*`，包间依赖用 `workspace:*`

## D005 三对话职责边界 = 前端 / 服务端 / API(契约+AI设计)
- 日期：2026-06-29
- 决策：保留 3 对话，但「API」对话定义为 shared 契约层 + AI Prompt 设计，不写业务运行时代码
- 背景：用户担心服务端对话负载过重；纯 REST 接口设计对话与服务端边界模糊
- 替代方案：2 对话（前端+服务端含AI）/ 3 对话（API=REST设计）
- 理由：契约独立可避免双对话都改 shared 引起冲突；AI Prompt 设计独立可保证质量
- 影响：
  - `packages/shared` 与 `packages/ai` 由 API 对话专责
  - `packages/server/src/ai` 是 AI 运行时调用实现，归服务端对话
  - 前端禁直连 AI 供应商，必须经 server REST 转发

## D006 AI 调用链路
- 日期：2026-06-29
- 决策：前端 → server REST → server/src/ai → AI 供应商；API Key 仅 server env
- 约束：`packages/ai` 仅放 Prompt 模板与配置占位，永不持有真实 Key
- 影响：`.env` 仅存在于 `packages/server`，`.gitignore` 已排除

## D007 分支与提交规范
- 日期：2026-06-29
- 决策：
  - 分支：`feature/fe-xxx` / `feature/server-xxx` / `feature/contract-xxx` / `fix/*`
  - 提交：Conventional Commits，scope 强制（mp/server/shared/ai）
  - 跨包改动必须拆成多个分支顺序合并，禁止一个分支跨包
- 影响：见 `docs/COLLABORATION.md`
