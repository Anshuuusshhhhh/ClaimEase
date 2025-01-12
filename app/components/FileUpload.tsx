'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  onDiagnosis: (diagnosis: string) => void
}

export default function FileUpload({ onUpload, onDiagnosis }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
      onUpload(newFiles)

      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', newFiles[0])

      try {
        const response = await fetch('/api/diagnose', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to get diagnosis')
        }

        const data = await response.json()
        onDiagnosis(data.diagnosis)
      } catch (error) {
        console.error('Error:', error)
        onDiagnosis('Failed to get diagnosis. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(updatedFiles)
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('uploadDocuments')}</h2>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? t('processing') : t('clickToUpload')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('fileTypes')}
          </span>
        </label>
      </div>
      {uploadedFiles.length > 0 && (
        <ul className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
              <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700" disabled={isLoading}>
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

