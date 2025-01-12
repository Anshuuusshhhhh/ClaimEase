'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '../components/FileUpload'
import UserInputForm from '../components/UserInputForm'
import Chatbot from '../components/Chatbot'
import { useTranslation } from '../hooks/useTranslation'

export default function EvaluateClaim() {
  const [files, setFiles] = useState<File[]>([])
  const [userInputs, setUserInputs] = useState({})
  const [diagnosis, setDiagnosis] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles([...files, ...uploadedFiles])
  }

  const handleDiagnosis = (newDiagnosis: string) => {
    setDiagnosis(newDiagnosis)
  }

  const handleUserInput = (inputs: any) => {
    setUserInputs(inputs)
  }

  const handleSubmit = async () => {
    if (diagnosis) {
      router.push(`/results?diagnosis=${encodeURIComponent(diagnosis)}`)
    } else {
      console.error('No diagnosis available')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        {t('evaluateClaim')}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <FileUpload onUpload={handleFileUpload} onDiagnosis={handleDiagnosis} />
          <UserInputForm onSubmit={handleUserInput} />
          {diagnosis && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{t('preliminaryDiagnosis')}</h2>
              <p>{diagnosis}</p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-colors shadow-lg"
            disabled={!diagnosis}
          >
            {t('submitEvaluation')}
          </button>
        </div>
        <div>
          <Chatbot />
        </div>
      </div>
    </div>
  )
}

