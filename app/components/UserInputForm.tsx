'use client'

import { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'

interface UserInputFormProps {
  onSubmit: (inputs: any) => void
}

export default function UserInputForm({ onSubmit }: UserInputFormProps) {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState({
    preExistingConditions: '',
    medicalHistory: '',
    currentSymptoms: '',
    familyHealthRisks: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputs)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('additionalInformation')}</h2>
      {Object.entries(inputs).map(([key, value]) => (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t(key as any)}
          </label>
          <textarea
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
      ))}
    </form>
  )
}

