# Tasks: synccode-project-spec

**Input**: Design documents from `/specs/001-synccode-project-spec/`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize repo skeleton and folders in repository root: create `backend/`, `frontend/`, `tools/`, `deploy/`, `docs/`
- [ ] T002 Initialize backend TypeScript project and package manifest: `backend/package.json`
- [ ] T003 Initialize frontend TypeScript project and package manifest: `frontend/package.json`
- [ ] T004 [P] Add linting and formatting configs: `.eslintrc.js`, `.prettierrc` at repo root
- [ ] T005 Create CI baseline workflow in `.github/workflows/ci.yml` (lint + unit tests)
- [ ] T006 [P] Add Dockerfiles for `backend/Dockerfile` and `frontend/Dockerfile` and a `docker-compose.yml` for local dev

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T007 Setup database migrations framework and initial schema files in `backend/db/migrations/` (PostgreSQL)
- [ ] T008 [P] Implement authentication skeleton (JWT + OIDC integration) in `backend/src/services/auth/`
- [ ] T009 [P] Create CRDT service skeleton (Yjs provider + WS server) in `backend/src/services/crdt/`
- [ ] T010 [P] Add Redis configuration and k8s manifests in `deploy/redis/` for CRDT sync caching
- [ ] T011 [P] Add Kafka (or RabbitMQ) manifests and config in `deploy/messaging/`
- [ ] T012 [P] Integrate observability bootstrap (OpenTelemetry init) in `backend/src/observability/`
- [ ] T013 Add SonarQube/quality scan configuration and CI job in `.github/workflows/ci.yml` and `ci/sonar.properties`
- [ ] T014 Create SDD template and docs in `docs/sdd-template.md`

## Phase 3: User Story 1 - 创建并管理工作区 (Priority: P1)

- [ ] T015 [P] [US1] Create `Workspace` model in `backend/src/models/workspace.ts`
- [ ] T016 [US1] Implement `WorkspaceService` in `backend/src/services/workspace.service.ts`
- [ ] T017 [US1] Implement Workspace REST endpoints in `backend/src/controllers/workspace.controller.ts`
- [ ] T018 [P] [US1] Add unit tests for Workspace model/service in `backend/tests/unit/test_workspace.spec.ts`
- [ ] T019 [US1] Implement frontend `WorkspaceList` and `WorkspaceCreate` components in `frontend/src/components/`
- [ ] T020 [US1] Add integration tests for Workspace API in `backend/tests/integration/test_workspace_api.spec.ts`

## Phase 4: User Story 2 - 文档实时协作与代码同步 (Priority: P1)

- [ ] T021 [P] [US2] Implement Yjs sync server (WebSocket provider) in `backend/src/services/yjs-provider.ts`
- [ ] T022 [US2] Implement `Document` model and storage handlers in `backend/src/models/document.ts`
- [ ] T023 [US2] Implement API to convert document -> code baseline (create branch + push) in `backend/src/controllers/transform.controller.ts`
- [ ] T024 [P] [US2] Implement sandbox creation and controller integration in `backend/src/services/sandbox.service.ts`
- [ ] T025 [P] [US2] Add E2E test for multi-client editing and transform flow in `e2e/tests/crdt_transform.spec.ts`
- [ ] T026 [US2] Implement frontend collaborative editor integration in `frontend/src/components/Editor.tsx`

## Phase 5: User Story 3 - 提交前质量门与自动化评价 (Priority: P2)

- [ ] T027 [P] [US3] Implement evaluation pipeline consumer service in `backend/src/services/evaluation.service.ts`
- [ ] T028 [US3] Integrate static analysis (ESLint) and SonarQube runner in CI workflow `.github/workflows/ci.yml`
- [ ] T029 [US3] Implement scoring calculation module in `backend/src/utils/scoring.ts`
- [ ] T030 [US3] Add contract tests for evaluation and scoring in `backend/tests/contract/test_evaluation.spec.ts`
- [ ] T031 [US3] Enforce CI gate to block merges when `Score < threshold` via `.github/workflows/ci.yml` checks
- [ ] T032 [US3] Add monitoring alert rules for evaluation/quality regressions in `deploy/monitoring/alerts.yaml`

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T033 [P] Documentation updates: update `docs/` and `quickstart.md` with final instructions
- [ ] T034 [P] Performance benchmarking and tuning for CRDT & sandbox (scripts in `tools/load/`)
- [ ] T035 Security hardening: RBAC, TLS, secret management manifests in `deploy/security/`
- [ ] T036 [P] Visual regression tests for frontend via Storybook/Chromatic in `frontend/.storybook/`
- [ ] T037 [P] Final acceptance tests and release checklist in `checklists/release.md`
 - [ ] T038 [P] Implement sandbox Warm Pool manager and reuse strategy in `backend/src/services/sandbox/warm_pool.ts` and add k8s manifests in `deploy/sandbox/warm-pool/`
 - [ ] T039 [P] Create performance benchmark scripts and load generators in `tools/load/bench/` (scripts to measure p95, throughput)
 - [ ] T040 [P] Add CI performance verification job in `.github/workflows/benchmark.yml` that runs bench scripts and records p95 results (fail if p95 > threshold)
 - [ ] T041 [P] Implement scoring time-decay module (λ default 0.7) in `backend/src/utils/scoring_decay.ts` and add unit/integration tests
 - [ ] T042 [P] Configure metrics & log retention policies: Prometheus retention config and EFK log retention/archival manifests in `deploy/monitoring/` and `deploy/logging/`
 - [ ] T043 [P] Make Score threshold configurable in CI and implement validation tests; add configuration reference in `docs/` and CI workflow checks

## Dependencies & Execution Order

- Setup (Phase 1) must complete before Foundational (Phase 2)
- Foundational (Phase 2) blocks all User Story work
- User stories (Phase 3+) may run in parallel after foundational readiness

## Parallel Opportunities

- Tasks marked `[P]` can run in parallel (different files, minimal cross-dependencies)
- Example parallel groups: lint/config, Dockerfile + docker-compose, Redis/Kafka manifests, observability init, unit tests


