import React, { useCallback, useEffect, useState } from 'react'
import z, { set } from 'zod'
import { StepperProps } from '@/types/stepper.type'
import { useRemitaInline } from '@farayolaj/react-remita-inline'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { useBioDataStore } from '@/stores/bio-data-store'
import { usePaymentStore } from '@/stores/payment-store'

// Generate unique transaction ID
const generateTransactionId = () =>
  String(Math.floor(Math.random() * 1_101_233))

const useCreatePayment = createPostMutationHook({
  endpoint: '/payment',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Payment({ handleNext }: StepperProps) {
  const { formData: bioData } = useBioDataStore()
  const { formData, setFormData } = usePaymentStore()
  const [paymentData] = useState({
    key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=',
    transactionId: generateTransactionId(),
    amount: 10000,
    customerId: bioData?.email,
    narration: 'LRCN Application Fee',
    email: bioData?.email,
    firstName: bioData?.firstName,
    lastName: bioData?.lastName,
  })

  // Mutation hook
  const registerPaymentMutation = useCreatePayment()

  // Complete application flow
  const completeApplication = useCallback(() => {
    registerPaymentMutation.mutate(
      {
        status: 'completed',
        isPaymentVerified: true,
      },
      {
        onSuccess: (responseData) => {
          toast.success('Your application was submitted successfully!')
          setFormData(responseData[0])
          handleNext()
        },
        onError: (error) => {
          console.error('Payment completion error:', error)
          toast.error('Something went wrong. Please try again.')
        },
      }
    )
  }, [registerPaymentMutation, setFormData, handleNext])

  // Remita init config
  const { initPayment } = useRemitaInline({
    isLive: false,
    onClose() {
      toast.warning(`Payment process was not completed.`)
      console.log('Remita closed')
    },
    onError(response) {
      toast.error(`Payment Failed! Please try again.`)
      console.log('Remita Error:', response)
    },
    onSuccess(response) {
      toast.success(`Payment Successful!`)
      console.log('Remita Success:', response)
      completeApplication()
    },
  })

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Payment</h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        An Applicant is required to pay a non-refundable processing fee.
      </h4>
      <p>Proceed with Remita Payment</p>

      <button
        className='bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700'
        disabled={formData.isPaymentVerified}
        onClick={() => initPayment(paymentData)}
      >
        Pay Now
      </button>
    </div>
  )
}

export default Payment
