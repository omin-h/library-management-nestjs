import React, { useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SendButton from './SendButton'

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat!', time: new Date().toLocaleTimeString() },
  ])
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    const msg = {
      id: Date.now(),
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    }
    setMessages((m) => [...m, msg])
    setInput('')
    // later: emit msg via socket here
  }

  return (
    <div style={{
      width: 400,
      maxWidth: '100%',
      border: '1px solid #ddd',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{ padding: 12, borderBottom: '1px solid #eee', background: '#fafafa' }}>
        <strong>Chat</strong>
      </div>

      <div style={{ flex: 1, padding: 12, overflowY: 'auto', minHeight: 180 }}>
        <MessageList messages={messages} />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #eee' }}>
        <MessageInput value={input} onChange={setInput} onEnter={handleSend} />
        <SendButton onClick={handleSend} disabled={!input.trim()} />
      </div>
    </div>
  )
}