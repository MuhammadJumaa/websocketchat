'use client'

import { useState, useEffect, useRef } from 'react'
import { WEBSOCKET_URL } from '../app/config'

interface Message {
  text: string;
  timestamp: string;
  sender: string;
}

export default function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState('Disconnected')
  const [inputMessage, setInputMessage] = useState('')
  const [username, setUsername] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set username on client-side only
    setUsername(`User_${Math.floor(Math.random() * 1000)}`)

    // Create WebSocket connection
    wsRef.current = new WebSocket(WEBSOCKET_URL)

    // Connection opened
    wsRef.current.onopen = () => {
      setStatus('Connected')
    }

    // Listen for messages
    wsRef.current.onmessage = (event) => {
      const newMessage: Message = {
        text: event.data,
        timestamp: new Date().toLocaleTimeString(),
        sender: event.data.includes(username) ? 'You' : 'Other'
      }
      setMessages(prev => [...prev, newMessage])
      
      // Scroll to bottom when new message arrives
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
    }

    // Connection closed
    wsRef.current.onclose = () => {
      setStatus('Disconnected')
    }

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, []) // Remove username from dependencies

  // Effect for handling messages with username
  useEffect(() => {
    if (!wsRef.current || !username) return;

    const messageHandler = (event: MessageEvent) => {
      const newMessage: Message = {
        text: event.data,
        timestamp: new Date().toLocaleTimeString(),
        sender: event.data.includes(username) ? 'You' : 'Other'
      }
      setMessages(prev => [...prev, newMessage])
      
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
    }

    wsRef.current.onmessage = messageHandler;
  }, [username])

  const sendMessage = () => {
    if (inputMessage.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      const messageToSend = `${username}: ${inputMessage}`
      wsRef.current.send(messageToSend)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          Status: <span className={status === 'Connected' ? 'text-green-600' : 'text-red-600'}>{status}</span>
        </div>
        <div className="text-sm">
          Your name: <span className="font-medium">{username || 'Connecting...'}</span>
        </div>
      </div>
      
      <div ref={chatBoxRef} className="border rounded-lg p-4 h-[400px] mb-4 overflow-y-auto bg-white">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <span className="text-gray-500 text-xs">{msg.timestamp}</span>
            <div className={`inline-block rounded p-2 mt-1 max-w-[80%] ${
              msg.sender === 'You' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!username || status !== 'Connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}
