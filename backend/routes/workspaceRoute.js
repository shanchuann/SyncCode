const express = require('express');
const router = express.Router();
const workspaceService = require('../services/workspaceService');

router.post('/', (req, res) => {
  const ws = workspaceService.createWorkspace(req.body);
  res.status(201).json(ws);
});

router.get('/', (req, res) => {
  res.json(workspaceService.listWorkspaces());
});

router.get('/:id', (req, res) => {
  const ws = workspaceService.getWorkspace(req.params.id);
  if (!ws) return res.status(404).json({ error: 'not_found' });
  res.json(ws);
});

router.put('/:id', (req, res) => {
  const ws = workspaceService.updateWorkspace(req.params.id, req.body);
  if (!ws) return res.status(404).json({ error: 'not_found' });
  res.json(ws);
});

router.delete('/:id', (req, res) => {
  const ok = workspaceService.deleteWorkspace(req.params.id);
  if (!ok) return res.status(404).json({ error: 'not_found' });
  res.status(204).send();
});

module.exports = router;
