import { StepperProps } from '@/types/stepper.type'

function Instructions({ handleBack, handleNext, step }: StepperProps) {
  return (
    <>
      <p className='font-montserrat text-active font-normal italic'>
        Step {step}
      </p>
      <div className='space-y-6'>
        {/* Header */}
        <header>
          <h2 className='font-montserrat mb-1 text-xl font-semibold text-gray-800'>
            Instructions
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            Please read all instructions carefully to ensure a smooth
            application flow.
          </h4>
        </header>

        {/* Step A */}
        <section>
          <p className='text-active mb-2 text-sm font-semibold'>
            A. Mode of Registration:
          </p>
          <ol className='list-inside list-decimal space-y-1 text-sm text-gray-700'>
            <li>
              Proceed to the designated LRCN website and navigate to the
              registration portal.
            </li>
            <li>Complete the online application form.</li>
            <li>
              Pay the non-refundable processing fee electronically using the
              provided payment gateway.
            </li>
          </ol>
        </section>

        {/* Step B */}
        <section>
          <p className='text-active mb-2 text-sm font-semibold'>
            B. Required Documents:
          </p>
          <ol className='list-inside list-decimal space-y-1 text-sm text-gray-700'>
            <li>
              Upload three passport-size photographs (ensure your name is
              clearly written behind each).
            </li>
            <li>Scan and upload copies of all relevant certificates.</li>
            <li>
              Upload a scanned copy of your Birth Certificate or a Statutory
              Declaration of Age.
            </li>
            <li>
              Provide scanned copies of any documents indicating a change of
              name, if applicable.
            </li>
            <li>
              Retain the original electronic payment confirmation as proof of
              payment.
            </li>
          </ol>
        </section>

        {/* Contact Info */}
        <section className='rounded-md border bg-gray-50 p-4'>
          <p className='text-active text-sm font-semibold'>
            For any inquiries or assistance, please contact the{' '}
            <strong>Registrar</strong> at LRCN Headquarters in Abuja or reach
            out to our support team via <strong>email</strong> or{' '}
            <strong>phone</strong>. We're here to help you through the
            registration process seamlessly.
          </p>
        </section>
      </div>

      {/* Navigation */}
      <div className='mt-6 flex justify-between'>
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`rounded border px-4 py-2 ${
            step === 1
              ? 'bg-gray-200 text-gray-400'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className='bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700'
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Instructions
