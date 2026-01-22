import { useEffect, useState } from 'react'
import z from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recommendationSubmitSchema } from '@/schemas/application'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { Button } from '@/components/ui/button'
import { useApplicationLock } from '@/utils/useApplicationLock'
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
  const {isLocked, isLockLoading} =  useApplicationLock()

  const registerRecommendationsMutation = useCreateRecommendations()

  // Format initialData - ensure it's an array wrapped in items
  const formattedInitialData = {
    items:
      Array.isArray(initialData) && initialData.length > 0
        ? initialData
        : [{ name: '', email: '', phoneNumber: '' }],
  }

  const form = useForm<z.infer<typeof recommendationSubmitSchema>>({
    resolver: zodResolver(recommendationSubmitSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData,
  })

  const { control, reset } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const { isValid, isDirty } = form.formState

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      reset({ items: initialData })
    }
  }, [initialData, reset])

  const isFormEmpty = formattedInitialData.items[0]?.name ? true : false

  const addReferee = () => {
    append({ name: '', email: '', phoneNumber: '' })
  }

  const removeReferee = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  function onSubmit(data: z.infer<typeof recommendationSubmitSchema>) {
    setIsLoading(true)

    if (isFormEmpty && !isDirty) {
      setIsLoading(false)
      handleNext()
      return
    }

    registerRecommendationsMutation.mutate(
      { recommendations: data.items },
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
        <fieldset disabled={isLocked || isLockLoading}>
          <p className='font-montserrat text-active font-normal italic'>
          Step {step}
        </p>
        <div className='space-y-6'>
          <div>
            <h2 className='font-montserrat mb-1 text-xl font-semibold'>
              Referees
            </h2>
            <h4 className='font-montserrat text-md text-active font-normal'>
              Please fill out all fields.
            </h4>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className='bg-background space-y-4 rounded-lg border border-gray-200 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Referee {index + 1}</p>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeReferee(index)}
                    className='text-xs text-red-500 hover:text-red-600'
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Name <span className='text-red-500'>*</span>
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
                name={`items.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Email <span className='text-red-500'>*</span>
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
                name={`items.${index}.phoneNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Phone Number <span className='text-red-500'>*</span>
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
          ))}

          <Button
            type='button'
            variant='ghost'
            onClick={addReferee}
            className='text-mainGreen hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Referee
          </Button>
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
        </fieldset>
      </form>
    </Form>
  )
}

export default Recommendations
