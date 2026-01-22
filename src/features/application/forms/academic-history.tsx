import { useEffect, useState } from 'react'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { academicHistorySubmitSchema } from '@/schemas/application'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface Institution {
  institution: string
  qualification: string
  startDate: string
  endDate: string
}

const useCreateAcadHist = createPostMutationHook({
  endpoint: '/applications',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function AcademicHistory({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
  initialData,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { isLocked, isLoading:isLockLoading} = useApplicationLock()

  const registerAcadHistMutation = useCreateAcadHist()

  // Format initialData to match form structure
  const formattedInitialData =
    initialData?.length > 0
      ? {
          items: initialData.map((record: any) => ({
            ...record,
            startDate: record.startDate?.split('T')[0] || '',
            endDate: record.endDate?.split('T')[0] || '',
          })),
        }
      : {
          items: [
            {
              institution: '',
              qualification: '',
              startDate: '',
              endDate: '',
            },
          ],
        }

  const form = useForm<z.infer<typeof academicHistorySubmitSchema>>({
    resolver: zodResolver(academicHistorySubmitSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData,
  })

  const { isValid, isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  useEffect(() => {
    if (initialData?.length > 0) {
      form.reset(formattedInitialData)
    }
  }, [initialData])

  const isFormEmpty = formattedInitialData.items.length > 0

  function onSubmit(data: z.infer<typeof academicHistorySubmitSchema>) {
    setIsLoading(true)

    if (isFormEmpty && !isDirty) {
      setIsLoading(false)
      handleNext()
      return
    }

    registerAcadHistMutation.mutate(
      { academicHistory: data.items },
      {
        onSuccess: () => {
          setIsLoading(false)
          toast.success(`Academic History saved successfully!`)
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('academic history error:', error)
          toast.error('Failed to save Academic History. Please try again.')
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
          <h2 className='font-montserrat mb-1 text-xl font-semibold'>
            Academic History
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            List all tertiary institutions attended starting from the most
            recent.
          </h4>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className='bg-background space-y-4 rounded-lg border p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='font-montserrat text-base font-bold'>
                  Tertiary Institution {index + 1}
                </p>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-sm text-red-500 hover:text-red-600'
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`items.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Institution <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter institution name'
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
                name={`items.${index}.qualification`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm'>
                      Qualification Obtained{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='mt-[12px] w-full rounded-[12px]'>
                          <SelectValue placeholder='Select qualification' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='BLIS'>BLIS</SelectItem>
                        <SelectItem value='BSc'>BSc</SelectItem>
                        <SelectItem value='MSc'>MSc</SelectItem>
                        <SelectItem value='PhD'>PhD</SelectItem>
                        <SelectItem value='HND'>HND</SelectItem>
                        <SelectItem value='OND'>OND</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex space-x-4'>
                <FormField
                  control={form.control}
                  name={`items.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm'>
                        Start Date <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='date'
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
                  name={`items.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm'>
                        End Date <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type='button'
            variant='ghost'
            onClick={() =>
              append({
                institution: '',
                qualification: '',
                startDate: '',
                endDate: '',
              })
            }
            className='text-mainGreen hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Institution
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

export default AcademicHistory
