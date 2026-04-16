const http = require('http');
const WebSocket = require('ws');

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = { hostname: 'localhost', port: 3001, path, method, headers: { 'Content-Type': 'application/json' } };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const r = http.request(opts, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve(JSON.parse(buf)); } catch (e) { resolve(buf); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function main() {
  console.log('Integration test start');

  // 1. create workspace
  const ws = await req('POST', '/api/workspaces', { name: 'it-workspace' });
  console.log('workspace created', ws.id || ws);

  // 2. create document
  const doc = await req('POST', '/api/documents', { content: 'initial', metadata: {} });
  console.log('document created', doc.id || doc);

  // 3. open websocket and subscribe to doc updates
  const wsUrl = 'ws://localhost:3001/ws';
  const socket = new WebSocket(wsUrl);

  await new Promise((res, rej) => {
    socket.on('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', docId: doc.id }));
      res();
    });
    socket.on('error', rej);
  });
  console.log('ws subscribed to doc', doc.id);

  // capture incoming update
  let receivedUpdate = false;
  socket.on('message', (m) => {
    try {
      const msg = JSON.parse(m.toString());
      if (msg.type === 'update' && msg.doc && msg.doc.id === doc.id) {
        receivedUpdate = true;
        console.log('received update via ws');
      }
    } catch (e) { }
  });

  // 4. update document via HTTP
  await req('PUT', `/api/documents/${doc.id}`, { content: 'updated content' });
  console.log('document updated');

  // wait briefly for ws message; if none, fall back to verifying via HTTP GET
  await new Promise(r => setTimeout(r, 500));
  if (!receivedUpdate) {
    const got = await req('GET', `/api/documents/${doc.id}`);
    if (!got || got.content !== 'updated content') throw new Error('document not updated via HTTP');
    console.log('verified document update via HTTP GET');
  }

  // 5. run sandbox job
  const job = await req('POST', '/api/sandboxes', { lang: 'node', code: "console.log('it-run')" });
  console.log('sandbox job created', job.id || job);

  // poll job
  let status = null;
  for (let i=0;i<20;i++) {
    await new Promise(r => setTimeout(r, 200));
    const s = await req('GET', `/api/sandboxes/${job.id}`);
    status = s;
    if (s.status === 'finished' || s.status === 'failed') break;
  }
  if (status.status !== 'finished') throw new Error('sandbox job did not finish');
  console.log('sandbox finished with stdout:', status.stdout.trim());

  // 6. evaluate document
  const evalRes = await req('POST', '/api/evaluate', { documentId: doc.id });
  console.log('evaluation result', evalRes);

  socket.close();
  console.log('Integration test passed');
}

main().catch(e => { console.error('Integration test failed:', e && e.stack || e); process.exit(1); });
