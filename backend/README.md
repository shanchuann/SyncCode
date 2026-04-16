# SyncCode Backend

This folder contains the backend service skeleton. Currently it provides a lightweight Express-based Workspace service used for early development and integration tests.

Quickstart (development):

- Install dependencies (in the `backend` folder):

```bash
npm install express body-parser
```

- Start the dev server:

```bash
npm run dev
```

The service exposes simple CRUD endpoints for workspaces under `/api/workspaces`.

This is a minimal scaffold; replace or extend with NestJS/Fastify and TypeScript as the project evolves.
