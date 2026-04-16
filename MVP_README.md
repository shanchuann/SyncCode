SyncCode MVP
===============

Quickstart (development):

- Start backend (from repo root):

```bash
cd backend
npm install
npm run dev
```

- Start frontend (in another terminal):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and the frontend will proxy API requests to the backend on port 3001.

Docker: build and run both services with docker-compose:

```bash
docker-compose up --build
```

What the MVP includes:

- Backend: Workspace, Documents (HTTP + WebSocket), Sandbox runner, Evaluation service, integration tests.
- Frontend: Minimal React UI to create/list/open documents, edit, save, evaluate, run sandbox.

Notes:
- Services use in-memory storage for rapid prototyping. Replace with persistent DB for production.
- Sandbox runs Node snippets with a short timeout — do not run untrusted code in production without isolation.
