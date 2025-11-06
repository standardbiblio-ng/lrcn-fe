// src/stores/upload-store.ts
import { z } from 'zod'
import { uploadSchema } from '@/schemas/uploadSchema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UploadedDocumentFormData = z.infer<typeof uploadSchema>

interface UploadedDocumentStore {
  formData: UploadedDocumentFormData
  markInitialized: () => void
  initialized: boolean
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
