import { z } from 'zod'
import { paymentSchema } from '@/schemas/payment'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentStore {
  formData: PaymentFormData
  markInitialized: () => void
  initialized: boolean
  setFormData: (data: Partial<PaymentFormData>) => void
  reset: () => void
}

const initialValues: PaymentFormData = {
  status: '',
  isPaymentVerified: false,
}

export const usePaymentStore = create<PaymentStore>()(
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
      name: 'payment-storage',
    }
  )
)
