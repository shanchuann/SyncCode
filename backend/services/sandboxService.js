const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class SandboxService {
  constructor() {
    // jobs: id -> { id, status: pending|running|finished|failed, lang, createdAt, startedAt, finishedAt, stdout, stderr, code }
    this.jobs = new Map();
  }

  _newId() {
    return `${Date.now()}-${Math.floor(Math.random()*10000)}`;
  }

  createJob({ lang = 'node', code = '' } = {}) {
    const id = this._newId();
    const job = { id, status: 'pending', lang, createdAt: new Date().toISOString() };
    this.jobs.set(id, job);
    // start asynchronously
    process.nextTick(() => this._run(id, lang, code));
    return job;
  }

  getJob(id) {
    return this.jobs.get(id) || null;
  }

  listJobs() {
    return Array.from(this.jobs.values());
  }

  _run(id, lang, code) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = 'running';
    job.startedAt = new Date().toISOString();
    this.jobs.set(id, job);

    if (lang === 'node') {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'synccode-'));
      const file = path.join(tmpDir, `${id}.js`);
      fs.writeFileSync(file, code || "console.log('')");
      const cmd = `node "${file}"`;
      const child = exec(cmd, { timeout: 5000, maxBuffer: 200 * 1024 }, (err, stdout, stderr) => {
        job.finishedAt = new Date().toISOString();
        job.stdout = stdout || '';
        job.stderr = stderr || '';
        if (err) {
          job.status = 'failed';
          job.code = err.code || 1;
        } else {
          job.status = 'finished';
          job.code = 0;
        }
        this.jobs.set(id, job);
        try { fs.unlinkSync(file); fs.rmdirSync(tmpDir); } catch (e) { }
      });
    } else {
      // Unsupported language placeholder
      job.finishedAt = new Date().toISOString();
      job.stdout = '';
      job.stderr = `unsupported language: ${lang}`;
      job.status = 'failed';
      job.code = 127;
      this.jobs.set(id, job);
    }
  }
}

module.exports = new SandboxService();
