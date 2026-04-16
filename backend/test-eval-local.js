const evalService = require('./services/evaluationService');

const doc = {
  id: 'local-1',
  content: 'function add(a,b){return a+b}\n// simple test included',
  metadata: { tests: true }
};

const result = evalService.evaluateDocumentObject ? evalService.evaluateDocumentObject(doc) : evalService.evaluate({ document: doc });
console.log('local evaluation result:', result);
