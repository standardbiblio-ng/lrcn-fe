import { useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recommendationSchema } from '@/schemas/recommendation'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { createPutMutationHook } from '@/api/hooks/usePut'
import { useRecommendationStore } from '@/stores/recommendation-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const useCreateRecommendations = createPostMutationHook({
  endpoint: '/applications/my/recommendations',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

const useUpdateRecommendations = createPutMutationHook({
  endpoint: '/applications/my/recommendations',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Recommendations({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const registerRecommendationsMutation = useCreateRecommendations()
  const updateRecommendationsMutation = useUpdateRecommendations()

  const { formData, setFormData } = useRecommendationStore()

  // console.log('prevRecommendations:', prevRecommendations)

  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    mode: 'onChange',
    defaultValues: formData,
  })

  const { isValid, isDirty } = form.formState

  const isFormEmpty = formData?.name ? true : false

  function onSubmit(data: z.infer<typeof recommendationSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    if (isFormEmpty) {
      if (!isDirty) {
        console.log('No changes detected, moving to next step')
        // when i want to move to next step without changes
        setIsLoading(false)
        handleNext()
        return
      }
      updateRecommendationsMutation.mutate(data, {
        // registerRecommendationsMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Updated Recommendations Successfully!`)
          // console.log('Updated recommendations responseData:', responseData)
          setFormData(responseData[0])
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error(' recommendations update error:', error)

          toast.error('Failed to update Recommendations. Please try again.')
        },
      })
    } else {
      // console.log('registering recommendations....')
      registerRecommendationsMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Recorded Recommendations Successfully!`)
          setFormData(responseData[0])
          // move to the next step in the application process
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('recommendations register error:', error)

          toast.error('Failed to record Recommendations. Please try again.')
        },
      })
    }
  }

  if (status === 'pending')
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p className='font-montserrat text-active font-normal italic'>
          Step {step}
        </p>
        <div className='space-y-4'>
          <h2 className='font-montserrat mb-1 text-xl font-semibold'>
            Recommendations Information
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            Please fill out all fields.
          </h4>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                {/* className='block text-sm' */}
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    {...field}
                    className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter email'
                    {...field}
                    className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='Phone Number'
                    {...field}
                    className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Navigation */}
        <div className='mt-6 flex justify-between'>
          <button
            onClick={handleBack}
            disabled={isLoading}
            className={`rounded border px-4 py-2 ${
              step === 1
                ? 'bg-gray-200 text-gray-400'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            type='submit'
            disabled={
              isLoading ||
              (step !== lastCompletedStep && // ✅ If not the lastCompletedStep, apply form validity/dirty checks
                (isFormEmpty
                  ? !isDirty // Update: Only enable when form has changed
                  : !isValid)) // Next: Only enable when form is valid
            }
            className={`bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700 ${
              (isLoading ||
                (step !== lastCompletedStep &&
                  (isFormEmpty ? !isDirty : !isValid))) &&
              'cursor-not-allowed opacity-50'
            }`}
          >
            {'Next'}
          </button>
        </div>
      </form>
    </Form>
  )
}

export default Recommendations
