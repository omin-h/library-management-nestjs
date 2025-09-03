import React, { useEffect, useRef, useState } from 'react';
import socket from '../services/socket';

export default function LlmPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(''); // streaming answer
  const [streaming, setStreaming] = useState(false);
  const idRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      connectedRef.current = true;
    };
    const onDisconnect = () => {
      connectedRef.current = false;
    };

    const onStart = ({ id }) => {
      // start fresh for this id
      if (idRef.current === id) {
        setResponse('');
        setStreaming(true);
      }
    };

    const onChunk = ({ id, chunk }) => {
      if (idRef.current !== id) return;
      setResponse((r) => r + chunk);
    };

    const onEnd = ({ id }) => {
      if (idRef.current !== id) return;
      setStreaming(false);
      idRef.current = null;
    };

    const onError = ({ id, reason }) => {
      if (idRef.current !== id) return;
      setResponse((r) => r + `\n\n[Error] ${reason}`);
      setStreaming(false);
      idRef.current = null;
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('llm_start', onStart);
    socket.on('llm_chunk', onChunk);
    socket.on('llm_end', onEnd);
    socket.on('llm_error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('llm_start', onStart);
      socket.off('llm_chunk', onChunk);
      socket.off('llm_end', onEnd);
      socket.off('llm_error', onError);
      socket.disconnect();
    };
  }, []);

  function send() {
    const text = input.trim();
    if (!text) return;
    const id = `llm-${Date.now()}`;
    idRef.current = id;
    setResponse(''); // clear prev
    setStreaming(false); // server will emit start
    setInput('');
    // optimistic UX — show placeholder (optional)
    setResponse((r) => r + ''); 

    if (!connectedRef.current) {
      setResponse('[Offline] Could not contact server.');
      return;
    }

    socket.emit('ask_llm', { id, text }, (ack) => {
      // optional ack handling
    });
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: '#fff'
    }}>
      <div style={{ width: '80%', maxWidth: 1200 }}>
        <h1 style={{ textAlign: 'center', fontWeight: 500, marginBottom: 28 }}>
          What are you working on?
        </h1>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 999,
            boxShadow: '0 6px 20px rgba(13, 14, 15, 0.06)',
            padding: '12px 16px'
          }}>
            <button style={{
              border: 'none', background: 'transparent', marginRight: 10, fontSize: 20, cursor: 'pointer'
            }}>＋</button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder="Ask anything"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 18,
                padding: '8px 6px'
              }}
            />

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
             

              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                style={{
                  borderRadius: 999,
                  border: 'none',
                  padding: '10px 14px',
                  background: streaming ? '#ddd' : '#7c3aed',
                  color: '#fff',
                  cursor: streaming ? 'not-allowed' : 'pointer'
                }}
              >
                {streaming ? 'Thinking…' : 'Ask'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, minHeight: 200, background: '#fafafa', padding: 18, borderRadius: 8 }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#0f172a' }}>
            {response || (streaming ? 'Waiting for response...' : 'Responses will appear here')}
          </div>
        </div>
      </div>
    </div>
  );
}