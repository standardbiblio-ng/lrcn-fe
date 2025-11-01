// src/store/daily-feeding.store.ts
import { z } from 'zod'
import { uploadSchema } from '@/schemas/uploadSchema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UploadedDocumentFormData = z.infer<typeof uploadSchema>

interface UploadedDocumentStore {
  formData: UploadedDocumentFormData
  setFormData: (data: Partial<UploadedDocumentFormData>) => void
  reset: () => void
}

const initialValues: UploadedDocumentFormData = {
  documents: [
    {
      name: '',
      fileUrl: '',
      fileType: '',
      uploadedAt: '2025-10-28T12:00:00Z',
    },
  ],
}

export const useUploadDocumentStore = create<UploadedDocumentStore>()(
  persist(
    (set) => ({
      formData: initialValues,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      reset: () => set({ formData: initialValues }),
    }),
    {
      name: 'uploaded-document-storage',
    }
  )
)
