import { z } from 'zod'
import { bioDataSchema } from '@/schemas/bioData'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatNigerianPhoneNumberWithoutCode } from '@/utils/phoneFormatter'

export type BioDataFormData = z.infer<typeof bioDataSchema>

interface BioDataStore {
  formData: BioDataFormData
  setFormData: (data: Partial<BioDataFormData>) => void
  reset: () => void
  markInitialized: () => void
  initialized: boolean
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
  gender: '',
}

export const useBioDataStore = create<BioDataStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      initialized: false,
      markInitialized: () => set({ initialized: true }),
      setFormData: (data) =>
        set((state) => {
          const updated = { ...state.formData, ...data }

          // ✅ Safely format phone number if present
          if (data.phoneNumber !== undefined && data.phoneNumber !== null) {
            updated.phoneNumber = formatNigerianPhoneNumberWithoutCode(
              data.phoneNumber
            )
          }

          // ✅ Safely handle dob if it includes a timestamp (e.g., "2025-10-28T12:00:00Z")
          if (data.dob && data.dob.includes('T')) {
            updated.dob = data.dob.split('T')[0]
          }

          return { formData: updated }
        }),
      reset: () => set({ formData: initialValues }),
    }),
    {
      name: 'bio-data-storage',
    }
  )
)
