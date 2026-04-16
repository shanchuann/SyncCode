const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({ hostname: 'localhost', port: 3001, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    // create a document
    const doc = await post('/api/documents', { content: 'function hello() { return 42; }\n// tests included', metadata: { tests: true } });
    console.log('created doc:', doc.id);

    // call evaluate and print raw response for debugging
    const raw = await post('/api/evaluate', { documentId: doc.id });
    try {
      console.log('evaluation:', raw);
    } catch (e) {
      console.log('raw response:', raw);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
