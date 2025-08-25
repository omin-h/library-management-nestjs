import React from 'react'
import MessageItem from './MessageItem'

export default function MessageList({ messages = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </div>
  )
}