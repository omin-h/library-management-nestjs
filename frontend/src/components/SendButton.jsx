import React from 'react'

export default function SendButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: 'none',
        background: disabled ? '#ccc' : '#2563eb',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      Send
    </button>
  )
}