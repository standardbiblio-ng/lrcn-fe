import { z } from 'zod'
import { acadHistoryRequestSchema } from '@/schemas/acadHistory'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AcademicHistoryFormData = z.infer<typeof acadHistoryRequestSchema>

interface AcademicHistoryStore {
  formData: AcademicHistoryFormData
  setFormData: (data: Partial<AcademicHistoryFormData>) => void
  reset: () => void
}

const initialValues: AcademicHistoryFormData = {
  items: [
    {
      institution: '',
      qualification: '',
      startDate: '',
      endDate: '',
    },
  ],
}

export const useAcademicHistoryStore = create<AcademicHistoryStore>()(
  persist(
    (set) => ({
      formData: initialValues,

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
            items:
              data?.items?.map((item) => ({
                ...item,
                startDate: item.startDate?.split('T')[0],
                endDate: item.endDate?.split('T')[0],
              })) || state.formData.items,
          },
        })),

      reset: () => set({ formData: initialValues }),
    }),
    {
      name: 'academic-history-storage',
    }
  )
)
