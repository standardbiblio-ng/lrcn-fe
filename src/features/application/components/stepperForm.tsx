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

  const handleNext = () => {
    markComplete(step)
    next(totalSteps)
  }

  const handleBack = () => {
    previous()
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation only if step is completed or is the next available step
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
        // Only allow payment if all previous steps are completed
        const allFormsCompleted =
          bioData &&
          academicHistory?.length > 0 &&
          employmentHistory?.length > 0 &&
          recommendations?.length > 0 &&
          documents?.length > 0 &&
          attestation

        if (!allFormsCompleted) {
          return (
            <div className='p-8 text-center'>
              <h2 className='mb-4 text-xl font-semibold'>
                Complete Required Forms
              </h2>
              <p className='text-gray-600'>
                Please complete all previous steps before proceeding to payment.
              </p>
            </div>
          )
        }

        return <Payment bioData={bioData} />
    }
  }

  return (
    <div className='flex min-h-screen overflow-y-auto'>
      {/* Sidebar Steps */}
      <aside className='bg-background/50 w-1/3 border-r p-6'>
        <ul className='space-y-4'>
          {steps.map((stepItem) => {
            // For payment step, ensure all previous steps are completed
            const isPaymentStep = stepItem.id === 8
            const canAccessPayment = isPaymentStep
              ? bioData &&
                academicHistory?.length > 0 &&
                employmentHistory?.length > 0 &&
                recommendations?.length > 0 &&
                documents?.length > 0 &&
                attestation
              : true

            const isClickable =
              stepItem.id <= maxStep && (!isPaymentStep || canAccessPayment)

            return (
              <li
                key={stepItem.id}
                onClick={() => isClickable && handleStepClick(stepItem.id)}
                className={`flex cursor-pointer flex-row justify-between space-x-2 rounded-lg p-3 ${
                  step === stepItem.id
                    ? 'bg-blue-100 text-blue-700'
                    : isClickable
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
            )
          })}
        </ul>
      </aside>

      {/* Main Content */}
      <main className='mb-40 flex-1 overflow-y-auto p-8'>
        {renderStepContent()}
      </main>
    </div>
  )
}
