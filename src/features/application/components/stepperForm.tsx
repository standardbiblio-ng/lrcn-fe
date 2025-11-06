import { useState } from 'react'
import z from 'zod'
import {
  ScrollText,
  Fingerprint,
  GraduationCap,
  BriefcaseBusiness,
  FileUp,
  Stamp,
  CreditCard,
  FileCheck,
} from 'lucide-react'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { useStepperStore } from '@/stores/application-stepper-store'
import AcademicHistory from '../forms/academic-history'
import Attestation from '../forms/attestation'
import BioData from '../forms/bio-data'
import EmploymentHistory from '../forms/employment-history'
import Instructions from '../forms/instructions'
import Payment from '../forms/payment'
import Recommendations from '../forms/recommendations'
import Upload from '../forms/upload'

const steps = [
  {
    id: 1,
    title: 'Instructions',
    description: 'Please Follow all Instructions',
    icon: ScrollText,
  },
  {
    id: 2,
    title: 'Bio-Data',
    description: 'Personal Details About You',
    icon: Fingerprint,
  },
  {
    id: 3,
    title: 'Academic History',
    description: 'Tertiary Institutions Attended',
    icon: GraduationCap,
  },
  {
    id: 4,
    title: 'Employment History',
    description: 'Details of your Work History',
    icon: BriefcaseBusiness,
  },
  {
    id: 5,
    title: 'Recommendations',
    description: 'Upload your recommendations',
    icon: FileUp,
  },
  {
    id: 6,
    title: 'Upload',
    description: 'Confirm Legitimacy of Application',
    icon: FileCheck,
  },
  {
    id: 7,
    title: 'Applicant Attestation',
    description: 'Confirm Legitimacy of Application',
    icon: Stamp,
  },
  {
    id: 8,
    title: 'Payment',
    description: 'Complete Application Fee',
    icon: CreditCard,
  },
]

// const useGetApplication = createGetQueryHook({
//   endpoint: '/applications/my-application',
//   responseSchema: z.any(),
//   queryKey: ['my-application'],
// })

export default function StepperForm() {
  const { step, maxStep, setStep, next, previous, markComplete } =
    useStepperStore()
  const totalSteps = steps.length

  const handleNext = () => {
    markComplete(step)
    next(totalSteps)
  }

  const handleBack = () => {
    previous()
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= maxStep) setStep(stepId)
  }
  // const { data, isPending } = useGetApplication()

  // console.log('data: ', data)

  // const handleNext = () => {
  //   if (currentStep < steps.length) {
  //     setCurrentStep(currentStep + 1)
  //   }
  // }

  // const handleBack = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1)
  //   }
  // }

  // const handleStepClick = (stepId: number) => {
  //   if (stepId < currentStep) {
  //     setCurrentStep(stepId)
  //   }
  // }

  // Example content renderer for each step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Instructions
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            // totalSteps={totalSteps}
          />
        )
      case 2:
        return (
          <BioData
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            // totalSteps={totalSteps}
          />
        )
      case 3:
        return (
          <AcademicHistory
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            // totalSteps={totalSteps}
          />
        )
      case 4:
        return (
          <EmploymentHistory
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            // totalSteps={totalSteps}
          />
        )
      case 5:
        return (
          <Recommendations
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            // totalSteps={totalSteps}
          />
        )
      case 6:
        return (
          <Upload
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
          />
        )
      case 7:
        return (
          <Attestation
          // handleBack={handleBack}
          // handleNext={handleNext}
          // step={step}
          // lastCompletedStep={maxStep}
          // totalSteps={totalSteps}
          />
        )
      case 8:
        return (
          <Payment
          // handleBack={handleBack}
          // handleNext={handleNext}
          // step={step}
          // lastCompletedStep={maxStep}
          // totalSteps={totalSteps}
          />
        )
    }
  }

  return (
    <div className='flex min-h-screen overflow-y-auto'>
      {/* Sidebar Steps */}
      <aside className='w-1/3 border-r bg-gray-50 p-6'>
        <ul className='space-y-4'>
          {steps.map((stepItem) => (
            <li
              key={stepItem.id}
              onClick={() => handleStepClick(stepItem.id)}
              className={`flex cursor-pointer flex-row justify-between space-x-2 rounded-lg p-3 ${
                step === stepItem.id
                  ? 'bg-blue-100 text-blue-700'
                  : stepItem.id <= maxStep
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'cursor-not-allowed text-gray-400'
              }`}
            >
              <div className='flex flex-col'>
                <span className='font-bold'>{stepItem.title}</span>
                <span className='text-xs'>{stepItem.description}</span>
              </div>
              <div className='flex size-10 items-center justify-center rounded-full bg-[#C1C1C1]'>
                <stepItem.icon />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className='mb-40 flex-1 overflow-y-auto p-8'>
        {renderStepContent()}
      </main>
    </div>
  )
}
