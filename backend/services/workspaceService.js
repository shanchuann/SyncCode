class WorkspaceService {
  constructor() {
    this.store = new Map();
  }

  createWorkspace(data = {}) {
    const id = Date.now().toString();
    const ws = { id, name: data.name || `workspace-${id}`, createdAt: new Date().toISOString(), ...data };
    this.store.set(id, ws);
    return ws;
  }

  getWorkspace(id) {
    return this.store.get(id) || null;
  }

  listWorkspaces() {
    return Array.from(this.store.values());
  }

  updateWorkspace(id, data = {}) {
    if (!this.store.has(id)) return null;
    const prev = this.store.get(id);
    const updated = { ...prev, ...data, updatedAt: new Date().toISOString() };
    this.store.set(id, updated);
    return updated;
  }

  deleteWorkspace(id) {
    return this.store.delete(id);
  }
}

module.exports = new WorkspaceService();
