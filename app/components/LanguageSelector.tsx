'use client'

import { useContext } from 'react'
import { Globe } from 'lucide-react'
import { LanguageContext } from './LanguageProvider'
import { Language } from '../translations'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
]

export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-transparent border-none pr-8 py-2 pl-2 text-gray-700 dark:text-gray-300 focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
    </div>
  )
}

