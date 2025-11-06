import { z } from 'zod'
import { employmentHistorySchema } from '@/schemas/employHistory'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type EmploymentHistoryFormData = z.infer<typeof employmentHistorySchema>

interface EmploymentHistoryStore {
  formData: EmploymentHistoryFormData
  markInitialized: () => void
  initialized: boolean
  setFormData: (data: Partial<EmploymentHistoryFormData>) => void
  reset: () => void
}

const initialValues: EmploymentHistoryFormData = {
  employer: '',
  address: '',
  status: '',
  startDate: '',
  workExperience: [
    {
      organisation: '',
      positionHeld: '',
      startDate: '',
    },
  ],
}

export const useEmploymentHistoryStore = create<EmploymentHistoryStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      initialized: false,
      markInitialized: () => set({ initialized: true }),
      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
            startDate:
              data.startDate?.split('T')[0] || state.formData.startDate,
            workExperience:
              data.workExperience?.map((exp) => ({
                ...exp,
                startDate: exp.startDate?.split('T')[0] || '',
              })) || state.formData.workExperience,
          },
        })),
      reset: () => set({ formData: initialValues }),
    }),
    {
      name: 'employment-history-storage',
    }
  )
)
