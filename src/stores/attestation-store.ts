import { z } from 'zod'
import { attestationSchema } from '@/schemas/attestation'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AttestationFormData = z.infer<typeof attestationSchema>

interface AttestationStore {
  formData: AttestationFormData
  markInitialized: () => void
  initialized: boolean
  setFormData: (data: Partial<AttestationFormData>) => void
  reset: () => void
}

const initialValues: AttestationFormData = {
  agreed: false,
}

export const useAttestationStore = create<AttestationStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      initialized: false,
      markInitialized: () => set({ initialized: true }),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      reset: () => set({ formData: initialValues, initialized: false }),
    }),
    {
      name: 'attestation-storage',
    }
  )
)
