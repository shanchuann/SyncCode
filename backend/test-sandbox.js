const http = require('http');

function postJob(code) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ lang: 'node', code });
    const req = http.request({ hostname: 'localhost', port: 3001, path: '/api/sandboxes', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJob(id) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001/api/sandboxes/${id}`, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const job = await postJob("console.log('hello-sandbox')");
    console.log('created:', job);
    const id = job.id;
    // poll for result
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 300));
      const status = await getJob(id);
      console.log('status:', status.status || status);
      if (status.status === 'finished' || status.status === 'failed') {
        console.log('result:', status);
        break;
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
