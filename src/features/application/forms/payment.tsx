import { useState } from 'react'
import z from 'zod'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { ConfirmApplicationDialog } from '../components/success-appl-dialog'

// Declare global RmPaymentEngine
declare global {
  interface Window {
    RmPaymentEngine: {
      init: (config: any) => {
        showPaymentWidget: () => void
      }
    }
  }
}

const useInitiatePayment = createPostMutationHook({
  endpoint: '/payment/initialize',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Payment({ bioData }: { bioData: any }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    auth: { user },
  } = useAuthStore()

  const initiatePaymentMutation = useInitiatePayment()

  const onOpenChange = (value: boolean) => setOpen(value)

  const handlePayment = async () => {
    if (
      user?.role === 'applicant' &&
      (!bioData?.email || !bioData?.otherNames || !bioData?.lastName)
    ) {
      toast.error(
        'Bio data is incomplete. Please complete your bio data first.'
      )
      return
    }

    setIsLoading(true)

    // Step 1: Get RRR from backend
    initiatePaymentMutation.mutate(
      {},
      {
        onSuccess: (response: any) => {
          setIsLoading(false)
          const rrr = response.data.rrr

          // Step 2: Initialize Remita payment with RRR
          if (!window.RmPaymentEngine) {
            toast.error('Payment system not loaded. Please refresh the page.')
            return
          }

          const paymentEngine = window.RmPaymentEngine.init({
            key: import.meta.env.VITE_REMITA_PUBLIC_KEY,
            processRrr: true,
            transactionId: response.data.transation_id,
            extendedData: {
              customFields: [
                {
                  name: 'rrr',
                  value: rrr,
                },
              ],
            },
            onSuccess: (response: any) => {
              console.log('Payment Successful Response:', response)
              toast.success('Payment Successful!')
              onOpenChange(true)
            },
            onError: (response: any) => {
              console.log('Payment Error Response:', response)
              toast.error('Payment Failed! Please try again.')
            },
            onClose: () => {
              console.log('Payment widget closed')
              toast.warning('Payment process was not completed.')
            },
          })

          paymentEngine.showPaymentWidget()
        },
        onError: (error) => {
          console.error('RRR Generation Error:', error)
          setIsLoading(false)
          toast.error('Failed to initiate payment. Please try again.')
        },
      }
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Payment</h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        An Applicant is required to pay a non-refundable processing fee.
      </h4>
      <p>Proceed with Remita Payment</p>

      <Button
        className='bg-mainGreen hover:bg-blue-700'
        onClick={handlePayment}
        disabled={isLoading || !(bioData?.email || user?.email)}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>

      <ConfirmApplicationDialog
        open={open}
        onOpenChange={onOpenChange}
        className='sm:max-w-sm'
      />
    </div>
  )
}

export default Payment
