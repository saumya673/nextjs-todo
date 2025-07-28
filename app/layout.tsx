import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'My To-Do App',
  description: 'A simple to-do list built with Next.js and Tailwind',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-pink-50 text-pink-900">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
