<!--
Sync Impact Report

Version change: UNSET -> 1.0.0
Modified principles: placeholder tokens -> concrete principles emphasizing 代码质量, 测试标准, 用户体验一致性, 性能要求
Added sections: 原则与技术选型指南
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated (符合宪法核查项)
- .specify/templates/spec-template.md: ✅ updated (已将测试与可测性作为强制项)
- .specify/templates/tasks-template.md: ⚠ pending (测试任务由可选改为强制，需人工调整样例说明)
Follow-up TODOs:
- RATIFICATION_DATE: TODO(RATIFICATION_DATE): 确认项目正式批准日期并替换占位符
-->

# SyncCode Constitution

## Core Principles

### 一、代码质量为上（Code Quality FIRST）
项目必须将代码质量作为首要约束。代码必须可读、可维护、符合团队约定的静态检查与复杂度阈值。所有生产代码必须通过自动化静态分析（如 ESLint/CheckStyle、SonarQube）并满足最低阈值才能合并。

技术选型与实现决策指引：优先选择有成熟静态分析、格式化与生态支持的语言与框架；在语言/框架之间选择时，以工具链成熟度（lint、formatter、IDE 支持）作为关键决策因子。

### 二、测试优先与覆盖保证（Test-First & Measurable Coverage）
采用测试驱动或先测试后实现的工作流：每个新功能必须有针对性的单元测试、关键路径的集成测试与端到端（E2E）验收测试。覆盖率应有明确门槛（例如：关键模块不低于 80% 分支/函数覆盖），并在 CI 中作为质量门禁。

技术选型与实现决策指引：选择支持快速可靠测试的框架（pytest、JUnit、Jest、cargo test 等）；CI 平台与镜像需能高效运行测试（并行化、缓存构建产物）。对性能敏感模块优先引入基准测试工具与剖析器（benchmark、profiler）。

### 三、用户体验一致性（UX Consistency & Accessibility）
用户界面与交互必须保持一致性与可访问性标准（WCAG 级别参考或团队自定义可达性规范）。交付的 UI 组件应可复用、主题化，并通过视觉回归测试与可用性验收流程验证。

技术选型与实现决策指引：前端框架与组件库应支持主题、可访问性扩展与视觉回归（如 Storybook + Chromatic）；移动/桌面目标应统一设计系统与样式变量以保证体验一致性。

### 四、性能与可观测性（Performance & Observability）
系统必须为关键场景定义可量化的性能目标（例如 p95 <200ms、沙箱启动 <3s 等），并在开发/测试中持续验证。所有服务必须暴露指标（Prometheus 格式）、结构化日志与分布式追踪以便快速定位性能退化。

技术选型与实现决策指引：优先选择对性能可观测性有良好支持的运行时与框架（例如支持 OpenTelemetry、原生指标导出），在中间件/数据库/消息队列选型时，将性能、可伸缩性与监控栈集成成本纳入评估。

### 五、工程化与自动化（Engineering Rigor & Automation）
所有重复性流程必须自动化：代码风格、测试、静态扫描、构建、部署与评价应由 CI/CD 流水线驱动。合并到主分支必须通过质量门（lint、tests、score 阈值）。

技术选型与实现指引：优先采用易于自动化且与现有云/容器平台集成良好的工具（Kubernetes、Containerd、GitOps 支持的 CI/CD 工具）。选择易于在镜像中运行并可缓存依赖的构建工具以提升流水线效率。

## 原则与技术选型指南
本节把前述原则具象化为技术评估维度：

- **可测性优先**：任何候选技术必须能够被自动化测试覆盖（单元/集成/端到端）；无法自动测的技术需提供替代检测方案并标注风险。
- **工具链成熟度**：优先有成熟 LSP、调试、静态分析与社区支持的语言/框架。
- **可观测性与运维成本**：评估运行时是否容易采集指标并与 Prometheus/OpenTelemetry 集成；评估在故障场景下的诊断成本。
- **性能可证实**：对关键路径进行基准测试并将结果作为可接受门槛，选型必须在目标负载下给出可验证的性能数据。
- **工程化成本**：优先考虑易于容器化、镜像体积合理、冷启动/预热策略可行的组件。

## Development Workflow（开发工作流与质量门）

- **分支策略**：Feature branches + PR 必须关联任务，并在 PR 中附带测试报告与评分（自动化评价系统 Score）。
- **质量门（Gates）**：所有 PR 必须通过：静态检查、单元测试、关键集成测试、评分阈值（Score >= 阈值）与可用性回归（如有 UI 变更）。
- **代码审查**：至少 1 次同行审查，复杂变更须附架构说明与风险评估。
- **回滚与迁移**：破坏性变更需声明兼容策略、迁移脚本与回退步骤。

## Governance

1. 宪法的优先级高于日常实践；任何偏离需在 PR 中说明理由并在变更记录中记录批准人。
2. 修订流程：小幅措辞修正为 Patch（不需治理批准）；新增原则或实质性改动为 Minor；重定义或删除原则为 Major。修订需在 PR 中说明影响与迁移计划。
3. 审计与合规：每个迭代周期（建议每季度）运行一次自动化合规检查，生成合规报告供治理委员会审阅。

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): 待确认 | **Last Amended**: 2026-04-16
