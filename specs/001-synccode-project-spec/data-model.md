# data-model.md

## Entities

### Workspace
- id: bigint (PK)
- name: varchar(255)
- owner_id: bigint (FK -> users)
- mode: enum('idea','code')
- created_at: timestamptz
- updated_at: timestamptz
- indexes: idx_workspace_owner(owner_id)

### Document
- id: bigint (PK)
- workspace_id: bigint (FK -> workspace)
- type: varchar(50)
- content: jsonb (Yjs snapshot or CRDT state)
- version: int
- last_modified_at: timestamptz
- tombstone/soft-delete flag if needed
- indexes: idx_document_workspace(workspace_id)

### Sandbox
- id: bigint (PK)
- user_id: bigint (FK)
- workspace_id: bigint (FK)
- container_id: varchar(255)
- branch_name: varchar(100)
- status: varchar(50)
- created_at, updated_at

### Task / Evaluation
- id: bigint (PK)
- workspace_id: bigint
- assignee_id: bigint
- status: varchar
- commit_id: varchar(100)
- score: float
- detail: jsonb
- indexes: idx_evaluation_commit(commit_id)

## Notes
- Use JSONB for CRDT snapshots to allow querying metadata but store raw Yjs binary in object storage if size large.
- Maintain audit tables for operations (append-only) to support time-decay scoring.
