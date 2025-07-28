'use client'

import React from 'react'

interface FooterProps {
  count: number
  onClear: () => void
}

export default function Footer({ count, onClear }: FooterProps) {
  return (
    <footer className="flex justify-between items-center py-6 px-4 mt-auto text-pink-400">
      <p>
        Total Tasks: <span className="font-bold text-pink-600">{count}</span>
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 border border-pink-400 rounded-lg hover:bg-pink-200"
      >
        Clear All
      </button>
    </footer>
  )
}
