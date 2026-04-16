import React, { useEffect, useState, useRef } from 'react'

export default function App() {
  const [workspaces, setWorkspaces] = useState([])
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [content, setContent] = useState('')
  const wsRef = useRef(null)

  useEffect(() => { fetchWorkspaces(); fetchDocuments(); }, [])

  async function fetchWorkspaces() {
    const res = await fetch('/api/workspaces', { method: 'GET' })
    const body = await res.json()
    setWorkspaces(body)
  }

  async function fetchDocuments() {
    const res = await fetch('/api/documents')
    const body = await res.json()
    setDocuments(body)
  }

  async function createDocument() {
    const res = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: 'New document' }) })
    const doc = await res.json()
    setDocuments(d => [doc, ...d])
  }

  function openDoc(doc) {
    setSelectedDoc(doc)
    setContent(doc.content || '')
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null }
    const ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws')
    ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', docId: doc.id }))
    ws.onmessage = (m) => {
      try {
        const msg = JSON.parse(m.data)
        if (msg.type === 'update' && msg.doc && msg.doc.id === doc.id) {
          setContent(msg.doc.content || '')
        }
      } catch (e) { }
    }
    wsRef.current = ws
  }

  async function saveDoc() {
    if (!selectedDoc) return
    await fetch('/api/documents/' + selectedDoc.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
  }

  async function runEval() {
    if (!selectedDoc) return
    const res = await fetch('/api/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentId: selectedDoc.id }) })
    const body = await res.json()
    alert('Score: ' + (body.score||0).toFixed(3) + '\nPassed: ' + body.passed)
  }

  async function runSandbox() {
    const code = prompt('Enter JS code to run in sandbox', "console.log('hi')")
    if (!code) return
    const res = await fetch('/api/sandboxes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: 'node', code }) })
    const job = await res.json()
    const id = job.id
    const poll = setInterval(async () => {
      const r = await fetch('/api/sandboxes/' + id)
      const s = await r.json()
      if (s.status === 'finished' || s.status === 'failed') {
        clearInterval(poll)
        alert('Sandbox finished - stdout:\n' + (s.stdout||'') )
      }
    }, 400)
  }

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ width: 260 }}>
        <h2>Workspaces</h2>
        <button onClick={fetchWorkspaces}>Refresh</button>
        <ul>
          {workspaces.map(w => <li key={w.id}>{w.name}</li>)}
        </ul>
        <h2>Documents</h2>
        <button onClick={createDocument}>New Document</button>
        <ul>
          {documents.map(d => <li key={d.id}><a href="#" onClick={(e)=>{e.preventDefault(); openDoc(d)}}>{d.id}</a></li>)}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Editor</h2>
        {selectedDoc ? (
          <div>
            <div>Doc: {selectedDoc.id}</div>
            <textarea value={content} onChange={e=>setContent(e.target.value)} style={{ width: '100%', height: 300 }} />
            <div style={{ marginTop: 8 }}>
              <button onClick={saveDoc}>Save</button>
              <button onClick={runEval} style={{ marginLeft: 8 }}>Evaluate</button>
              <button onClick={runSandbox} style={{ marginLeft: 8 }}>Run Sandbox</button>
            </div>
          </div>
        ) : <div>Select a document to edit</div>}
      </div>
    </div>
  )
}
