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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        // soft light gradient background
        background: 'linear-gradient(180deg, #f8fbff 0%, #f3f7ff 50%, #ffffff 100%)',
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        color: '#0f172a',
      }}
    >
      <div
        style={{
          width: '86%',
          maxWidth: 1000,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          <h1 style={{ margin: 0, fontWeight: 600, fontSize: 28 }}>What are you working on?</h1>
          <p style={{ margin: '8px 0 0', color: '#475569' }}>
            Ask anything — the AI will stream its reply in real time.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: 999,
              boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
              padding: '12px 16px',
              border: '1px solid rgba(15,23,42,0.04)',
            }}
          >
           

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Ask anything"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 18,
                padding: '8px 6px',
                color: '#0f172a',
                background: 'transparent',
              }}
            />

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              

              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                style={{
                  borderRadius: 999,
                  border: 'none',
                  padding: '10px 16px',
                  background: streaming ? 'linear-gradient(90deg,#e2e8f0,#f1f5f9)' : 'linear-gradient(90deg,#7c3aed,#5b21b6)',
                  color: streaming ? '#475569' : '#fff',
                  cursor: streaming ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  boxShadow: streaming ? 'none' : '0 6px 18px rgba(124,58,237,0.18)',
                }}
              >
                {streaming ? 'Thinking…' : 'Ask'}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            minHeight: 220,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,255,0.8))',
            padding: 20,
            borderRadius: 12,
            border: '1px solid rgba(15,23,42,0.04)',
            boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ color: '#334155', fontWeight: 600 }}>Response</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              {streaming ? 'Streaming…' : 'Idle'}
            </div>
          </div>

          <div
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              color: '#727273ff',
              fontSize: 16,
              minHeight: 140,
            }}
          >
            {response || (!streaming ? 'Responses will appear here' : 'Waiting for response...')}
          </div>
        </div>
      </div>
    </div>
  );
}