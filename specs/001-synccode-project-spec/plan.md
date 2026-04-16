# Implementation Plan: synccode-project-spec

**Branch**: `001-synccode-project-spec` | **Date**: 2026-04-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-synccode-project-spec/spec.md`

## Summary

选择一套成熟、社区广泛支持且适合云原生部署的技术栈，以保障快速开发、可观测性与可维护性。计划分三阶段：Phase 0（研究与决策），Phase 1（设计与契约），Phase 2（实施与交付）。

## Technical Context

**Language/Version**: Node.js 20.x + TypeScript 5.x (后台)，React 18 + TypeScript（前端）
**Primary Dependencies**:
- Backend: NestJS（推荐）或 Fastify（高性能轻量）
- CRDT: Yjs + websocket provider
- Frontend: React + Vite + Storybook + Chromatic
- DB: PostgreSQL
- Cache/CRDT sync: Redis Cluster
- Messaging: Kafka（或 RabbitMQ 作为备选）
- Container runtime: Containerd
- Orchestration: Kubernetes
- CI: GitHub Actions
- GitOps部署: ArgoCD（或 Flux）
- Observability: Prometheus + Grafana + OpenTelemetry + Jaeger
- Logging: EFK (Elasticsearch + Fluent Bit + Kibana)
- Static analysis & quality: ESLint, Prettier, SonarQube
- Testing: Jest (unit), Playwright (E2E), Vitest (frontend)

**Storage**: PostgreSQL primary, S3-compatible object storage for artifacts
**Testing**: Jest, Playwright, Testcontainers for integration scenarios
**Target Platform**: Linux containers on Kubernetes
**Project Type**: Web service + frontend + VS Code extension
**Performance Goals**: p95 < 200ms (collab), sandbox startup <3s
**Constraints**: 成本敏感、需高并发 CRDT 同步能力
**Scale/Scope**: 初期 10k 日活，长期可扩展到 100k+

## Constitution Check

Gates (from `.specify/memory/constitution.md`):
- 必须通过静态检查工具链与质量阈值；
- 必须有自动化测试覆盖并在 CI 中作为门禁；
- 必须暴露指标并集成 Prometheus/OpenTelemetry。

这些将作为 Phase 0 输出的可验收门（必须在 Phase 0 完成前列明并确认）。

## Project Structure

```
specs/001-synccode-project-spec/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── checklists/
```

## Phase 0: Outline & Research

1. 决定后端框架（NestJS vs Fastify 原生）：评估开发效率、模块化、生态与性能。
2. 确认 CRDT 方案（Yjs + WebSocket/Redis PubSub）：确认同步拓扑与快照策略。
3. 选择消息队列（Kafka 推荐，评估成本）：写出替代方案（RabbitMQ）。
4. 测试策略与 CI 细节（并行测试、缓存、镜像构建）：验证 GitHub Actions 可行性并衡量并行化成本。
5. Observability 集成方案（OpenTelemetry SDK 采样策略 + Prometheus exporters）。

Output: `research.md` — 每项列出决策、理由与替代方案。

## Phase 1: Design & Contracts

Prereq: `research.md` complete

1. `data-model.md`: 抽出核心实体（Workspace、Document、Sandbox、Evaluation）并补充字段、索引、约束。
2. `contracts/`:
   - REST API contract for Workspace management (OpenAPI YAML)
   - Contract for Git/commit webhook endpoints
3. `quickstart.md`: 开发者在本地运行最小可用环境的步骤（启动服务、运行测试、运行 e2e）。
4. Agent context update: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`（手动触发或在自动化脚本中运行）

## Phase 2: Implementation (high level)

1. Foundation: 项目骨架、CI 工作流、容器构建与部署 pipeline。
2. Implement core services: Workspace service, Document (CRDT) service, Sandbox controller, Evaluation pipeline。
3. Tests: 单元、集成与 E2E
4. Observability & SLOs: 指标档案与仪表盘

## Complexity Tracking

无重大违宪项；若选型偏离宪法需在 PR 中说明理由并添加迁移计划。

***

Deliverables created by this plan run:
- `specs/001-synccode-project-spec/plan.md` (this file)
- `specs/001-synccode-project-spec/research.md`
- `specs/001-synccode-project-spec/data-model.md`
- `specs/001-synccode-project-spec/quickstart.md`
- `specs/001-synccode-project-spec/contracts/` (contract files)

