import React from 'react'

export default function MessageItem({ message }) {
  return (
    <div style={{
      padding: 8,
      borderRadius: 6,
      background: '#f1f5f9',
      alignSelf: 'flex-start',
      maxWidth: '85%',
      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)'
    }}>
      <div style={{ fontSize: 14 }}>{message.text}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{message.time}</div>
    </div>
  )
}