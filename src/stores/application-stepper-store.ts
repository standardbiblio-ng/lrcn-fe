import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StepperStore {
  step: number // current step user is on
  maxStep: number // highest completed step
  setStep: (step: number) => void
  next: (totalSteps: number) => void
  previous: () => void
  markComplete: (step: number) => void
  reset: () => void
}

export const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      step: 1,
      maxStep: 1,
      setStep: (step) => set({ step }),
      next: (totalSteps) =>
        set((state) => ({
          step: Math.min(state.step + 1, totalSteps),
        })),
      previous: () =>
        set((state) => ({
          step: Math.max(state.step - 1, 1),
        })),
      markComplete: (step) =>
        set((state) => ({
          maxStep: Math.max(state.maxStep, step),
        })),
      reset: () => set({ step: 1, maxStep: 1 }),
    }),
    { name: 'stepper-storage' }
  )
)
