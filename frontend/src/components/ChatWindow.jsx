import React, { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SendButton from './SendButton'
import socket from '../services/socket'

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat!', time: new Date().toLocaleTimeString() },
  ])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const connectedRef = useRef(false)

  useEffect(() => {
    socket.connect() // open the connection to the server

    const onConnect = () => {
      setConnected(true)
      connectedRef.current = true
    }
    const onDisconnect = () => {
      setConnected(false)
      connectedRef.current = false
    }
    const onMessage = (msg) => {
      if (!msg || !msg.text) return

      setMessages((m) => [...m, msg])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message', onMessage)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('message', onMessage)
      socket.disconnect() // close when component unmounts
    }
  }, [])

  function handleSend() {
    if (!input.trim()) return
    const msg = {
      id: Date.now(),
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    }
    setMessages((m) => [...m, msg]) // optimistic local add
    setInput('')

    if (connectedRef.current) {
      socket.emit('message', msg) // send to server
    } else {
      console.warn('Socket not connected - message sent locally only')
    }
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
      <div style={{ padding: 12, borderBottom: '1px solid #eee', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Chat</strong>
        <span style={{ fontSize: 12, color: connected ? '#10b981' : '#ef4444' }}>{connected ? 'online' : 'offline'}</span>
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