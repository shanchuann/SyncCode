const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');

router.post('/', (req, res) => {
  const doc = documentService.createDocument(req.body || {});
  res.status(201).json(doc);
});

router.get('/', (req, res) => {
  res.json(documentService.listDocuments());
});

router.get('/:id', (req, res) => {
  const doc = documentService.getDocument(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not_found' });
  res.json(doc);
});

router.put('/:id', (req, res) => {
  const doc = documentService.applyUpdate(req.params.id, req.body || {});
  if (!doc) return res.status(404).json({ error: 'not_found' });
  res.json(doc);
});

router.delete('/:id', (req, res) => {
  const ok = documentService.deleteDocument(req.params.id);
  if (!ok) return res.status(404).json({ error: 'not_found' });
  res.status(204).send();
});

module.exports = router;
