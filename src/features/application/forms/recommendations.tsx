import { useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recommendationSubmitSchema } from '@/schemas/application'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { Button } from '@/components/ui/button'
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
  endpoint: '/applications',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Recommendations({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
  initialData,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const registerRecommendationsMutation = useCreateRecommendations()

  // Format initialData - recommendations comes as array, we use first item
  const formattedInitialData = initialData?.length > 0 ? initialData[0] : {}

  const form = useForm<z.infer<typeof recommendationSubmitSchema>>({
    resolver: zodResolver(recommendationSubmitSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData,
  })

  const { isValid, isDirty } = form.formState

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (initialData?.length > 0) {
      form.reset(formattedInitialData)
    }
  }, [initialData])

  const isFormEmpty = formattedInitialData?.name ? true : false

  function onSubmit(data: z.infer<typeof recommendationSubmitSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    if (isFormEmpty && !isDirty) {
      // when i want to move to next step without changes
      setIsLoading(false)
      handleNext()
      return
    }

    registerRecommendationsMutation.mutate(
      { recommendations: [data] },
      {
        onSuccess: () => {
          setIsLoading(false)
          toast.success(`Recommendations saved successfully!`)
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('recommendations error:', error)
          toast.error('Failed to save Recommendations. Please try again.')
        },
      }
    )
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
                    className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2 capitalize'
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
          <Button
            type='button'
            variant='outline'
            onClick={handleBack}
            disabled={isLoading || step === 1}
          >
            Back
          </Button>
          <Button
            type='submit'
            disabled={
              isLoading ||
              (step !== lastCompletedStep &&
                (isFormEmpty ? !isDirty : !isValid))
            }
            className='bg-mainGreen hover:bg-blue-700'
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Recommendations
