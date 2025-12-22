// src/stores/upload-store.ts
import { z } from 'zod'
import { documentsSubmitSchema } from '@/schemas/application'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UploadedDocumentFormData = z.infer<typeof documentsSubmitSchema>

interface UploadedDocumentStore {
  formData: UploadedDocumentFormData
  markInitialized: () => void
  initialized: boolean
  setFormData: (data: Partial<UploadedDocumentFormData>) => void
  reset: () => void
}

const initialValues: UploadedDocumentFormData = {
  items: [
    {
      name: '',
      fileKey: '',
      fileType: '',
      uploadedAt: '2025-10-28T12:00:00Z',
    },
  ],
}

export const useUploadDocumentStore = create<UploadedDocumentStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      initialized: false,
      markInitialized: () => set({ initialized: true }),
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
