'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import VoiceRecorder from './VoiceRecorder'

const avatars = [
  { name: 'Dr. Heart', specialty: 'Cardiovascular' },
  { name: 'Dr. Metabolism', specialty: 'Metabolic Diseases' },
  { name: 'Dr. Organ', specialty: 'Major Organ Diseases' },
]

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([])
  const [input, setInput] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0])
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleSend = async (message: string) => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }])
      setInput('')
      setLoading(true)

      try {
        console.log('Attempting to send message:', message)
        console.log('Selected avatar:', selectedAvatar.specialty)
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMessage: message,
            specialty: selectedAvatar.specialty,
          }),
        })
        console.log('Response received:', response)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data && data.botMessage) {
          setMessages(prev => [...prev, { text: data.botMessage, sender: 'bot' }])
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching bot response:', error)
        let errorMessage = 'An error occurred while fetching the response.'
        if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`
        }
        setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleVoiceRecordingComplete = async (blob: Blob) => {
    const formData = new FormData()
    formData.append('audio', blob, 'recording.wav')

    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data && data.transcription) {
        handleSend(data.transcription)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setMessages(prev => [...prev, { text: 'Error transcribing audio. Please try again.', sender: 'bot' }])
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('chatWithSpecialist')}</h2>
      <div className="flex space-x-2 mb-4">
        {avatars.map((avatar) => (
          <button
            key={avatar.name}
            onClick={() => setSelectedAvatar(avatar)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedAvatar.name === avatar.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {avatar.name}
          </button>
        ))}
      </div>
      <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ml-auto'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
            } max-w-[80%] inline-block`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 dark:text-gray-400">
            {t('loading')}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={t('typeMessage')}
          className="flex-grow px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-l-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800"
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          <Send size={20} />
        </button>
        <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
      </div>
    </div>
  )
}

