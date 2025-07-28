'use client'

import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatbotContainer from './components/ChatbotContainer'

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [today, setToday] = useState('')

  useEffect(() => {
    const opts: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    setToday(new Date().toLocaleDateString('en-US', opts))
  }, [])

  const addTask = () => {
    const val = inputRef.current?.value.trim()
    if (!val) return alert('Please enter a task.')
    setTasks((t) => [...t, val])
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeTask = (i: number) =>
    setTasks((t) => t.filter((_, idx) => idx !== i))

  const clearAll = () => {
    if (confirm('Clear all tasks?')) setTasks([])
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTask()
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto py-8 px-4">
      {/* split header ends */}
      <Header title="Your To‑Do" date={today} />

      <p className="text-center text-pink-500 mb-8">
        “Plan Today, Prosper Tomorrow”
      </p>

      <div className="flex gap-4 mb-8">
        <input
          ref={inputRef}
          onKeyDown={handleKey}
          type="text"
          placeholder="Enter a new task..."
          className="flex-1 p-3 border-2 border-pink-300 rounded-lg bg-pink-100 focus:border-pink-600 focus:outline-none"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:scale-105 transform transition"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-pink-100">
            <tr>
              <th className="p-3 text-left">Task</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-center text-pink-300">
                  No tasks yet.
                </td>
              </tr>
            )}
            {tasks.map((task, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{task}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeTask(i)}
                    className="text-pink-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* split footer ends */}
      <Footer count={tasks.length} onClear={clearAll} />

      <div className="text-center text-pink-400 mt-4">
        Made with ❤ by Saumya
      </div>

   {/* chatbot sits here, now with an addTask callback */}
     <ChatbotContainer
       addTask={(todo: string) => {
         setTasks(t => [...t, todo])
       }}
     />
    </div>
  )
}
