import { useState } from 'react'
import { StepperProps } from '@/types/stepper.type'

interface DocumentType {
  type: string
  file: File | null
  preview: string | null
}

function Upload() {
  const documentTypes = { 1: 'NYSC', 2: 'BLIS', 3: 'NLA Certificate' }

  const [documents, setDocuments] = useState<DocumentType[]>([
    { type: '', file: null, preview: null },
  ])

  // Add new document
  const handleAddDocument = () => {
    setDocuments([...documents, { type: '', file: null, preview: null }])
  }

  // Remove document
  const handleRemoveDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index)
    setDocuments(updated)
  }

  // Handle type change
  const handleTypeChange = (index: number, newType: string) => {
    const updated = [...documents]
    updated[index].type = newType
    setDocuments(updated)
  }

  // Handle file upload & preview
  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const updated = [...documents]
        updated[index].file = file
        updated[index].preview = reader.result as string
        setDocuments(updated)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove specific file
  const removeFile = (index: number) => {
    const updated = [...documents]
    updated[index].file = null
    updated[index].preview = null
    setDocuments(updated)
  }

  // Filter out already selected document types
  const usedTypes = documents.map((doc) => doc.type)

  return (
    <div className='space-y-4'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Upload Documents
      </h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        Please upload valid and required documents.
      </h4>

      {documents.map((doc, index) => (
        <div
          key={index}
          className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
        >
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold'>Document {index + 1}</p>
            {documents.length > 1 && (
              <button
                onClick={() => handleRemoveDocument(index)}
                className='text-xs font-medium text-red-500 hover:underline'
              >
                Remove
              </button>
            )}
          </div>

          {/* Document Type */}
          <div>
            <label className='block text-sm'>Document type</label>
            <select
              value={doc.type}
              onChange={(e) => handleTypeChange(index, e.target.value)}
              className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
            >
              <option value=''>Select document type</option>
              {Object.entries(documentTypes)
                .filter(([key]) => !usedTypes.includes(key) || doc.type === key)
                .map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
            </select>
          </div>

          {/* Document upload + preview */}
          <div>
            <label className='mb-2 block text-sm'>Document</label>
            <div
              className={`bg-neutral2 relative mt-[12px] flex h-[150px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border lg:h-[200px]`}
              style={{
                backgroundImage: doc.preview ? `url(${doc.preview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!doc.preview && (
                <span className='text-sm text-gray-500'>
                  Click to upload document
                </span>
              )}

              <input
                type='file'
                accept='image/*,.pdf'
                onChange={(e) => handleFileChange(index, e)}
                className='absolute inset-0 cursor-pointer opacity-0'
              />

              {doc.preview && (
                <button
                  onClick={() => removeFile(index)}
                  type='button'
                  className='absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white'
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddDocument}
        className='text-mainGreen flex items-center font-medium hover:text-green-700'
      >
        <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
          +
        </span>
        Add Another Document
      </button>
    </div>
  )
}

export default Upload
