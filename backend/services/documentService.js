class DocumentService {
  constructor() {
    // store: id -> { id, content, version, createdAt, updatedAt }
    this.store = new Map();
    this._broadcaster = null;
  }

  createDocument(data = {}) {
    const id = Date.now().toString();
    const doc = {
      id,
      content: data.content || '',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: data.metadata || {}
    };
    this.store.set(id, doc);
    return doc;
  }

  getDocument(id) {
    return this.store.get(id) || null;
  }

  listDocuments() {
    return Array.from(this.store.values());
  }

  applyUpdate(id, patch) {
    const doc = this.store.get(id);
    if (!doc) return null;
    // For placeholder: patch can be {content} to replace whole content, or {ops: []}
    if (patch.content !== undefined) doc.content = patch.content;
    doc.version = (doc.version || 0) + 1;
    doc.updatedAt = new Date().toISOString();
    if (patch.metadata) doc.metadata = { ...doc.metadata, ...patch.metadata };
    this.store.set(id, doc);
    if (this._broadcaster) {
      try { this._broadcaster(doc); } catch (e) { }
    }
    return doc;
  }

  setBroadcaster(fn) {
    this._broadcaster = fn;
  }

  deleteDocument(id) {
    return this.store.delete(id);
  }
}

module.exports = new DocumentService();
