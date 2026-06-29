# semo 对话 Prompt 使用说明

## 三对话 prompt 文件
- [01-frontend-mp.md](./01-frontend-mp.md) — 前端对话（Uni-app 小程序）
- [02-server-nestjs.md](./02-server-nestjs.md) — 服务端对话（NestJS + AI 运行时）
- [03-api-contract.md](./03-api-contract.md) — API 对话（shared 契约 + AI 设计）

## 使用方式
1. 在 Trae / 其他 AI IDE 中新建 3 个独立对话
2. 把对应 .md 中代码块内的全部内容，作为该对话的第一条消息发送
3. 若该对话也是 Trae IDE，建议在第一条消息中追加："请先调用 multi-terminal-dev-standard skill 获得完整规范"
4. 之后所有需求都通过对应对话沟通，跨端需求经整合对话协调

## 整合对话（本对话）职责
- 跨端协调：接收需求 → 拆解 → 分发 → 汇总校验
- shared 变更评审：API 对话产出契约 → 整合对话评审 → 通知前后端同步
- 决策记录：维护 docs/DECISIONS.md
- 项目状态：维护 docs/.ai-context.md
- 进行中任务：维护 docs/.ai-memory.md
- 技术债：维护 docs/TECH_DEBT.md
- 协作规范：docs/COLLABORATION.md（铁律）

## 启动协议（每个对话新会话必做）
读取以下文件确认状态后再接收需求：
1. docs/.ai-context.md — 项目当前状态
2. docs/DECISIONS.md — 关键技术决策
3. docs/.ai-memory.md — 进行中任务
4. docs/TECH_DEBT.md — 技术债
5. docs/COLLABORATION.md — 协作铁律
