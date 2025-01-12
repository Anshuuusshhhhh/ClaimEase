'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { t } = useTranslation()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { id: Date.now(), text: input, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInput('')
      setIsTyping(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        })

        if (!response.ok) {
          throw new Error('Failed to get chatbot response')
        }

        const data = await response.json()
        
        // Simulate typing delay
        setTimeout(() => {
          const botMessage: Message = { id: Date.now(), text: data.response, sender: 'bot' }
          setMessages(prevMessages => [...prevMessages, botMessage])
          setIsTyping(false)
        }, Math.random() * 1000 + 1000) // Random delay between 1-2 seconds
      } catch (error) {
        console.error('Error:', error)
        setIsTyping(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('chatWithBot')}</h2>
        <button
          onClick={clearChat}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={t('clearChat')}
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 p-3 rounded-lg">
              {t('botIsTyping')}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('typeMessage')}
          className="flex-grow px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-l-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

