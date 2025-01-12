'use client'

import { useContext } from 'react'
import { LanguageContext } from '../components/LanguageProvider'
import { translations, TranslationKey } from '../translations'

export function useTranslation() {
  const { language } = useContext(LanguageContext)

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations.en[key] || key
  }

  return { t, language }
}

