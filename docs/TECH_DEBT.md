# semo 技术债登记

> 记录临时妥协、占位实现、待优化项。每条标注：位置 / 原因 / 计划 / 优先级。
> 代码中以 `// TODO(技术债):` 或 `// FIXME:` 标注，并在此登记。

## TD001 AI 客户端未接入真实 SDK
- 位置：`packages/server/src/ai/client.ts`（callAi 抛错占位）
- 原因：初始化阶段，AI 供应商尚未最终确认
- 计划：用户选定供应商后，引入 openai-node / @alicloud/dashscope-sdk 等填充实现
- 优先级：高（MVP 必须解决）

## TD002 food 模块仅占位
- 位置：`packages/server/src/modules/food/food.controller.ts`
- 原因：骨架阶段，待 shared 的 FoodRecognizeRequest 评审通过后实现
- 计划：服务端对话实现调用 AI 运行时 + 落库为打卡记录
- 优先级：高

## TD003 mp 未配置 vite + uni 构建文件
- 位置：`packages/mp`（缺 vite.config.ts、manifest.json、pages.json）
- 原因：Uni-app CLI 初始化需在用户本机执行（涉及小程序平台选择）
- 计划：用户首次跑 `pnpm install` 后，由前端对话用 Uni-app 脚手架补全
- 优先级：高

## TD004 DB 选型未最终确认
- 位置：`packages/server/.env.example`（DB_TYPE=postgres 占位）
- 原因：用户尚未确认 PostgreSQL / MySQL
- 计划：用户确认后固化 env.example 默认值与 typeorm 配置
- 优先级：中

## TD005 server 未接入 TypeORM 配置
- 位置：`packages/server/src/app.module.ts`（未 import TypeOrmModule）
- 原因：DB 选型待定
- 计划：DB 确认后，服务端对话补全 TypeOrmModule.forRoot + entities
- 优先级：中

## TD006 缺测试框架
- 位置：全项目
- 原因：初始化阶段
- 计划：MVP 后引入 jest（server）+ vitest（mp）
- 优先级：低
