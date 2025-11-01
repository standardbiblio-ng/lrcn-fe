import { z } from 'zod'
import { recommendationSchema } from '@/schemas/recommendation'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RecommendationFormData = z.infer<typeof recommendationSchema>

interface RecommendationStore {
  formData: RecommendationFormData
  setFormData: (data: Partial<RecommendationFormData>) => void
  reset: () => void
}

const initialValues: RecommendationFormData = {
  name: '',
  email: '',
  phoneNumber: '',
}

export const useRecommendationStore = create<RecommendationStore>()(
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
      name: 'recommendation-storage',
    }
  )
)
