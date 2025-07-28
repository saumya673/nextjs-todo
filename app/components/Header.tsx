'use client'

import React from 'react'

interface HeaderProps {
  title: string
  date: string
}

export default function Header({ title, date }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-6 text-2xl text-pink-600">
      <h1>{title}</h1>
      <div className="text-lg text-pink-400">{date}</div>
    </header>
  )
}
