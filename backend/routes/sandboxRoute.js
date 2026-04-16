const express = require('express');
const router = express.Router();
const sandboxService = require('../services/sandboxService');

// Create a sandbox run
router.post('/', (req, res) => {
  const { lang, code } = req.body || {};
  const job = sandboxService.createJob({ lang, code });
  res.status(202).json(job);
});

// List jobs
router.get('/', (req, res) => {
  res.json(sandboxService.listJobs());
});

// Get job status/result
router.get('/:id', (req, res) => {
  const job = sandboxService.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'not_found' });
  res.json(job);
});

module.exports = router;
