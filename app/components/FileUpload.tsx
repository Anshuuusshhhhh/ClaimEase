'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useRouter } from 'next/navigation'

interface FileUploadProps {
  onUpload: (files: File[]) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { t } = useTranslation()
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
      onUpload(newFiles)

      // Send POST request to localhost:5000/diagnosis
      const formData = new FormData()
      newFiles.forEach((file) => {
        formData.append('file', file)
      })

      try {
        const response = await fetch('http://localhost:5000/diagnosis', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Diagnosis result:', result)

        // Store the result in localStorage and navigate to results page
        localStorage.setItem('diagnosisResult', JSON.stringify(result))
        router.push('/results')
      } catch (error) {
        console.error('Error uploading files:', error)
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
          multiple
          className="hidden"
          id="file-upload"
          accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('clickToUpload')}
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
              <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

