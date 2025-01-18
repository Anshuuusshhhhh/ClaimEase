'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Loader } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

type ClaimStatus = 'Valid' | 'Needs Review' | 'Rejected' | 'Loading'

export default function Results() {
  const [status, setStatus] = useState<ClaimStatus>('Loading')
  const [diagnosis, setDiagnosis] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const storedResult = localStorage.getItem('diagnosisResult')
    if (storedResult) {
      const result = JSON.parse(storedResult)
      setDiagnosis(result.diagnosis)

      if (result.diagnosis.includes('valid') || result.diagnosis.includes('approved')) {
        setStatus('Valid')
      } else if (result.diagnosis.includes('review') || result.diagnosis.includes('additional information')) {
        setStatus('Needs Review')
      } else {
        setStatus('Rejected')
      }

      // Clear the stored result
      localStorage.removeItem('diagnosisResult')
    }
  }, [])

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'Valid':
        return 'text-green-500'
      case 'Needs Review':
        return 'text-yellow-500'
      case 'Rejected':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'Valid':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'Needs Review':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />
      case 'Rejected':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'Loading':
        return <Loader className="w-16 h-16 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">{t('claimEvaluationResults')}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        {getStatusIcon(status)}
        <h2 className={`text-2xl font-bold mt-4 ${getStatusColor(status)}`}>{t(status.toLowerCase() as any)}</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {diagnosis || (status === 'Loading' ? t('loadingMessage') : t(`${status.toLowerCase()}Message` as any))}
        </p>
      </div>
    </div>
  )
}

