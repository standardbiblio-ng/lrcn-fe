import { z } from 'zod'
import { acadHistorySchema } from '@/schemas/acadHistory'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AcademicHistoryFormData = z.infer<typeof acadHistorySchema>

interface AcademicHistoryStore {
  formData: AcademicHistoryFormData
  activeInputs: Record<string, boolean>
  setFormData: (data: Partial<AcademicHistoryFormData>) => void
  setActiveInput: (fieldName: string, isActive: boolean) => void
  reset: () => void
}

const initialValues: AcademicHistoryFormData = {
  institution: '',
  qualification: '',
  startDate: '',
  endDate: '',
}

export const useAcademicHistoryStore = create<AcademicHistoryStore>()(
  persist(
    (set) => ({
      formData: initialValues,

      activeInputs: {},
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setActiveInput: (fieldName, isActive) =>
        set((state) => ({
          activeInputs: { ...state.activeInputs, [fieldName]: isActive },
        })),
      reset: () => set({ formData: initialValues, activeInputs: {} }),
    }),
    {
      name: 'academic-history-storage',
    }
  )
)
