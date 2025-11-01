// src/store/daily-feeding.store.ts
import { z } from 'zod'
import { bioDataSchema } from '@/schemas/bioData'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BioDataFormData = z.infer<typeof bioDataSchema>

interface BioDataStore {
  formData: BioDataFormData
  activeInputs: Record<string, boolean>
  setFormData: (data: Partial<BioDataFormData>) => void
  setActiveInput: (fieldName: string, isActive: boolean) => void
  reset: () => void
}

const initialValues: BioDataFormData = {
  firstName: '',
  lastName: '',
  otherNames: '',
  previousNames: '',
  email: '',
  phoneNumber: '',
  nationality: '',
  state: '',
  lga: '',
  dob: '',
  gender: 'Male',
}

export const useBioDataStore = create<BioDataStore>()(
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
      name: 'bio-data-storage',
    }
  )
)
