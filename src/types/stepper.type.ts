export type StepperProps = {
  handleBack: () => void
  handleNext: () => void
  step: number
  // totalSteps?: number
  lastCompletedStep: number
}
