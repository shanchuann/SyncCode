const express = require('express');
const router = express.Router();
const evaluationService = require('../services/evaluationService');

// POST /api/evaluate
// body: { documentId?, document?, decayLambda?, ageSeconds? }
router.post('/', (req, res) => {
  const { documentId, document, decayLambda, ageSeconds } = req.body || {};
  const result = evaluationService.evaluate({ documentId, document, decayLambda, ageSeconds });
  if (result && result.error) return res.status(404).json(result);
  res.json(result);
});

module.exports = router;
