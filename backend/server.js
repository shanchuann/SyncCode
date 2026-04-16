const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const workspaceRouter = require('./routes/workspaceRoute');
const documentRouter = require('./routes/documentRoute');
const sandboxRouter = require('./routes/sandboxRoute');
const evaluationRouter = require('./routes/evaluationRoute');
const documentService = require('./services/documentService');

const app = express();
app.use(bodyParser.json());

app.use('/api/workspaces', workspaceRouter);
app.use('/api/documents', documentRouter);
app.use('/api/sandboxes', sandboxRouter);
app.use('/api/evaluate', evaluationRouter);

const port = process.env.PORT || 3001;

const server = http.createServer(app);

// WebSocket-based simple pub/sub for document updates
try {
	const WebSocket = require('ws');
	const wss = new WebSocket.Server({ server, path: '/ws' });

	// map docId -> Set of sockets
	const subscriptions = new Map();

	wss.on('connection', (ws, req) => {
		ws.isAlive = true;
		ws.on('pong', () => (ws.isAlive = true));

		ws.on('message', (message) => {
			let msg = null;
			try { msg = JSON.parse(message); } catch (e) { return; }
			const { type, docId, payload } = msg;
			if (type === 'subscribe' && docId) {
				const set = subscriptions.get(docId) || new Set();
				set.add(ws);
				subscriptions.set(docId, set);
				ws.docId = docId;
				// send current state
				const doc = documentService.getDocument(docId);
				if (doc) ws.send(JSON.stringify({ type: 'snapshot', doc }));
			}
			if (type === 'update' && docId && payload) {
				const updated = documentService.applyUpdate(docId, payload);
				if (updated) {
					const set = subscriptions.get(docId) || new Set();
					const msgout = JSON.stringify({ type: 'update', doc: updated });
					set.forEach(s => { if (s !== ws && s.readyState === WebSocket.OPEN) s.send(msgout); });
				}
			}
		});

		ws.on('close', () => {
			const docId = ws.docId;
			if (docId) {
				const set = subscriptions.get(docId);
				if (set) {
					set.delete(ws);
					if (set.size === 0) subscriptions.delete(docId);
				}
			}
		});
	});

	// heartbeat
	setInterval(() => {
		wss.clients.forEach((ws) => {
			if (!ws.isAlive) return ws.terminate();
			ws.isAlive = false;
			ws.ping(() => {});
		});
	}, 30000);
	// register broadcaster so HTTP updates can be pushed to subscribers
	const broadcastUpdate = (doc) => {
		const set = subscriptions.get(doc.id) || new Set();
		const msgout = JSON.stringify({ type: 'update', doc });
		set.forEach(s => { if (s.readyState === WebSocket.OPEN) s.send(msgout); });
	};
	try { documentService.setBroadcaster(broadcastUpdate); } catch (e) { }
} catch (e) {
	console.warn('ws not available, realtime document updates disabled');
}

server.listen(port, () => console.log(`Workspace & Documents service listening on ${port}`));

module.exports = server;
