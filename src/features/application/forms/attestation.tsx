import React, { useState } from 'react'
import { StepperProps } from '@/types/stepper.type'

function Attestation() {
  const [signature, setSignature] = useState<string | null>(null)

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setSignature(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeSignature = () => setSignature(null)

  return (
    <div className='space-y-4'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Applicant Attestation
      </h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        Please fill out all fields.
      </h4>

      <div className='flex flex-wrap items-center space-x-2'>
        <p className='text-base'>I</p>
        <div className='min-w-[120px] flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
          />
        </div>
        <p className='text-base'>
          attest that all information provided in the previous pages is true.
        </p>
      </div>

      <div className='flex flex-wrap space-x-4'>
        <div className='flex-1'>
          <label className='ml-4 inline text-sm'>Signature</label>
          <div
            className={`bg-neutral2 relative mt-[12px] flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border`}
            style={{
              backgroundImage: signature ? `url(${signature})` : 'none',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {!signature && (
              <span className='text-sm text-gray-500'>
                Click to upload signature
              </span>
            )}
            <input
              type='file'
              accept='image/*'
              onChange={handleSignatureChange}
              className='absolute inset-0 cursor-pointer opacity-0'
            />
            {signature && (
              <button
                type='button'
                onClick={removeSignature}
                className='absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white'
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className='flex-1'>
          <label className='ml-4 inline text-sm'>Date</label>
          <input
            type='date'
            className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
          />
        </div>
      </div>
    </div>
  )
}

export default Attestation
