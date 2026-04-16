const documentService = require('./documentService');

class EvaluationService {
  constructor() {
    this.SCORE_THRESHOLD = parseFloat(process.env.SCORE_THRESHOLD || '0.7');
  }

  // Evaluate a document object and return a score between 0 and 1
  evaluateDocumentObject(doc, options = {}) {
    const content = (doc && doc.content) ? String(doc.content) : '';
    const len = content.length;
    const hasTests = !!(doc && doc.metadata && doc.metadata.tests);

    // Simple heuristic scoring:
    // - base: 0.2
    // - length contribution: up to 0.5 (longer content -> higher score)
    // - tests presence: +0.2
    let score = 0.2;
    score += Math.min(0.5, (len / 2000) * 0.5);
    if (hasTests) score += 0.2;
    score = Math.max(0, Math.min(1, score));

    // optional decay by age (seconds) using lambda in [0,1]
    if (options.decayLambda !== undefined && options.ageSeconds !== undefined) {
      const lambda = Math.max(0, Math.min(1, Number(options.decayLambda) || 0));
      const age = Number(options.ageSeconds) || 0;
      // exponential decay towards 0 over time factor (1-lambda)
      const decay = Math.exp(-age * (1 - lambda) * 0.0001);
      score = score * decay;
    }

    return { score, passed: score >= this.SCORE_THRESHOLD, details: { length: len, hasTests } };
  }

  // Evaluate by document id (fetches document) or by passing doc object
  evaluate({ documentId, document, decayLambda, ageSeconds } = {}) {
    const doc = documentId ? documentService.getDocument(documentId) : (document || {});
    if (!doc) return { error: 'document_not_found' };
    return this.evaluateDocumentObject(doc, { decayLambda, ageSeconds });
  }
}

module.exports = new EvaluationService();
