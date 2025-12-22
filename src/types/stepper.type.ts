export type StepperProps = {
  handleBack?: () => void
  handleNext: () => void
  step?: number
  // totalSteps?: number
  lastCompletedStep?: number
  initialData?: any // Data fetched from API for the form
}
