import { useEffect } from 'react'
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
import { useGetMyApplication } from '@/api/hooks/useGetData'
import { useStepperStore } from '@/stores/application-stepper-store'
import { useAuthStore } from '@/stores/auth-store'
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

export default function StepperForm() {
  const { step, maxStep, setStep, next, previous, markComplete } =
    useStepperStore()
  const totalSteps = steps.length

  // Auth hook to get user role
  const {
    auth: { user },
  } = useAuthStore()

  console.log(user)

  // Fetch all application data once
  const { data: application } = useGetMyApplication()

  // Extract data for each form
  const bioData = application?.bioData
  const academicHistory = application?.academicHistory
  const employmentHistory = application?.employmentHistory
  const recommendations = application?.recommendations
  const documents = application?.documents
  const attestation = application?.attestation

  // Auto-mark completed steps when data loads
  useEffect(() => {
    if (!application) return

    if (bioData) markComplete(2)
    if (academicHistory?.length > 0) markComplete(3)
    if (employmentHistory?.length > 0) markComplete(4)
    if (recommendations?.length > 0) markComplete(5)
    if (documents?.length > 0) markComplete(6)
    if (attestation) markComplete(7)
  }, [
    application,
    bioData,
    academicHistory,
    employmentHistory,
    recommendations,
    documents,
    attestation,
    markComplete,
  ])

  // If user is 'member', allow skipping to payment
  const canSkipToPayment = user?.role === 'member'

  const handleNext = () => {
    markComplete(step)
    next(totalSteps)
  }

  const handleSkipToPayment = () => {
    setStep(8)
    markComplete(8)
  }

  const handleBack = () => {
    previous()
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= maxStep) setStep(stepId)
  }

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
            initialData={bioData}
          />
        )
      case 3:
        return (
          <AcademicHistory
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            initialData={academicHistory}
          />
        )
      case 4:
        return (
          <EmploymentHistory
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            initialData={employmentHistory}
          />
        )
      case 5:
        return (
          <Recommendations
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            initialData={recommendations}
          />
        )
      case 6:
        return (
          <Upload
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            lastCompletedStep={maxStep}
            initialData={documents}
          />
        )
      case 7:
        return (
          <Attestation
            handleBack={handleBack}
            handleNext={handleNext}
            initialData={{
              attestation,
              bioData,
              academicHistory,
              employmentHistory,
              recommendations,
              documents,
            }}
          />
        )
      case 8:
        return (
          <Payment
            // handleBack={handleBack}

            bioData={bioData}
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
      <aside className='bg-background/50 w-1/3 border-r p-6'>
        {canSkipToPayment && (
          <button
            className='mb-4 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700'
            onClick={handleSkipToPayment}
          >
            Skip to Payment
          </button>
        )}
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
