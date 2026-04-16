# quickstart.md

## Local Quickstart (dev)

Prereqs: Node 20.x, pnpm/npm, Docker (containerd compatible), kubectl, kind/minikube (optional)

1. Clone repo and switch to feature branch

```bash
git checkout 001-synccode-project-spec
pnpm install
```

2. Start local Postgres & Redis (docker-compose or use devcontainers)

3. Run backend in dev mode

```bash
cd backend
pnpm run dev
```

4. Run frontend

```bash
cd frontend
pnpm run dev
```

5. Run unit tests

```bash
pnpm test
```

6. Run e2e (Playwright)

```bash
pnpm pw:e2e
```

## Deploy to local k8s (kind)

1. Build images and load into kind
2. Apply manifests in `deploy/`

