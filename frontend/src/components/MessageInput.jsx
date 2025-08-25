import React from 'react'

export default function MessageInput({ value, onChange, onEnter }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter()
      }}
      placeholder="Type a message..."
      style={{
        flex: 1,
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid #ddd',
        outline: 'none'
      }}
    />
  )
}