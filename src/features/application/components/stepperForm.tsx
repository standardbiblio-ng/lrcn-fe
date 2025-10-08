import { useState } from 'react'
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
import AcademicHistory from '../forms/academic-history'
import Attestation from '../forms/attestation'
import BioData from '../forms/bio-data'
import EmploymentHistory from '../forms/employment-history'
import Instructions from '../forms/instructions'
import Payment from '../forms/payment'
import Recommendations from '../forms/recommendations'
import SubmitApplication from '../forms/submit-application'

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
    title: 'Recommendations & Upload',
    description: 'Confirm Legitimacy of Application',
    icon: FileUp,
  },
  {
    id: 6,
    title: 'Applicant Attestation',
    description: 'Confirm Legitimacy of Application',
    icon: Stamp,
  },
  {
    id: 7,
    title: 'Payment',
    description: 'Complete Application Fee',
    icon: CreditCard,
  },
  {
    id: 8,
    title: 'Submit Application',
    description: 'Await Approval',
    icon: FileCheck,
  },
]

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId)
    }
  }

  // Example content renderer for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Instructions />
      case 2:
        return <BioData />
      case 3:
        return <AcademicHistory />
      case 4:
        return <EmploymentHistory />
      case 5:
        return <Recommendations />
      case 6:
        return <Attestation />
      case 7:
        return <Payment />
      case 8:
        return <SubmitApplication />
    }
  }

  return (
    <div className='flex min-h-screen overflow-y-auto'>
      {/* Sidebar Steps */}
      <aside className='w-1/3 border-r bg-gray-50 p-6'>
        <ul className='space-y-4'>
          {steps.map((step) => (
            <li
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`flex cursor-pointer flex-row justify-between space-x-2 rounded-lg p-3 ${
                currentStep === step.id
                  ? 'bg-blue-100 text-blue-700'
                  : step.id < currentStep
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400'
              }`}
            >
              <div className='flex flex-col'>
                <span className='font-bold'>{step.title}</span>
                <span className='text-xs'>{step.description}</span>
              </div>
              <div className='flex size-10 items-center justify-center rounded-full bg-[#C1C1C1]'>
                <step.icon className='' />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className='mb-40 flex-1 overflow-y-auto p-8'>
        <p className='font-montserrat text-active font-normal italic'>
          Step {currentStep}
        </p>
        {renderStepContent()}

        {/* Navigation */}
        <div className='mt-6 flex justify-between'>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`rounded border px-4 py-2 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className='bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700'
          >
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  )
}
