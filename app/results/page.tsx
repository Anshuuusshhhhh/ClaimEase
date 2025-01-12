'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useSearchParams } from 'next/navigation'

type ClaimStatus = 'Valid' | 'Needs Review' | 'Rejected'

export default function Results() {
  const [status, setStatus] = useState<ClaimStatus>('Needs Review')
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const diagnosis = searchParams.get('diagnosis')

  useEffect(() => {
    // Determine status based on diagnosis
    if (diagnosis) {
      if (diagnosis.toLowerCase().includes('valid')) {
        setStatus('Valid')
      } else if (diagnosis.toLowerCase().includes('reject')) {
        setStatus('Rejected')
      } else {
        setStatus('Needs Review')
      }
    }
  }, [diagnosis])

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
          {t(`${status.toLowerCase()}Message` as any)}
        </p>
        {diagnosis && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{t('aiDiagnosis')}</h3>
            <p className="text-gray-700 dark:text-gray-300">{diagnosis}</p>
          </div>
        )}
      </div>
    </div>
  )
}

