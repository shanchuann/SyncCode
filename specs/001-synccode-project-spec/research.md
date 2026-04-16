# research.md

## Decisions

1. 后端框架：选择 **NestJS (Node.js + TypeScript)**。
   - Rationale: 强类型、模块化、成熟的依赖注入与生态，利于大型微服务架构与团队协作。与 TypeScript 前端共享类型更便捷。
   - Alternatives: Fastify 原生实现（更轻量更高吞吐，但开发速度/约定较少）。

2. CRDT 实现：**Yjs + WebSocket provider + Redis Pub/Sub for multi-node sync**。
   - Rationale: Yjs 社区成熟，性能好，支持 RGA，客户端集成简单。Redis Pub/Sub 用于节点间广播，结合快照机制控制日志大小。
   - Alternatives: Automerge（更慢，内存占用更高）。

3. 消息队列：**Kafka** 优先，**RabbitMQ** 作为成本敏感场景备选。
   - Rationale: Kafka 更适合高吞吐事件流与回放需求，便于构建评价流水线与审计。RabbitMQ 更适合轻量、延迟敏感的任务队列。

4. CI/CD：**GitHub Actions + ArgoCD (GitOps)**。
   - Rationale: GitHub Actions 与 GitHub 仓库紧密集成，易于并行化和缓存；ArgoCD 提供可靠的 GitOps 部署模式。

5. Observability：**OpenTelemetry + Prometheus + Grafana + Jaeger**。
   - Rationale: 标准化采集、链路追踪与可视化，便于快速定位性能瓶颈。

## Risks & Mitigations

- CRDT 日志膨胀：采用周期性快照 + 历史压缩策略；对大型文档分片处理。
- Kafka 成本/运维：可通过托管 Kafka（Confluent Cloud）或使用 Cloud-managed alternatives。

## Action Items (Phase 0 completion)

- 确认 NestJS 快速原型（API + Yjs 集成 PoC）。
- 评估 Redis Pub/Sub 性能在预期并发下的延迟。
- 建立 CI 基线（Lint + Unit tests）在 GitHub Actions 中运行。

