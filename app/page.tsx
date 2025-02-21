'use client'

import WebSocketChat from '../components/WebSocketChat'

export default function SyntheticcumaaPageForDeployment() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">WebSocket Chat</h1>
        <WebSocketChat />
      </div>
    </main>
  )
}