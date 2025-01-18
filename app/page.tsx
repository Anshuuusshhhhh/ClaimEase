'use client'

import Link from 'next/link'
import { useTranslation } from './hooks/useTranslation'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <h1 className="text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        {t('welcome')}
      </h1>
      <p className="text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-2xl">
        {t('description')}
      </p>
      <Link
        href="/evaluate"
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg"
      >
        {t('startEvaluation')}
      </Link>
    </div>
  )
}

