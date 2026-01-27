import { useEffect, useState } from 'react'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employmentHistorySubmitSchema } from '@/schemas/application'
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

const useCreateEmploymentHistory = createPostMutationHook({
  endpoint: '/applications',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function EmploymentHistory({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
  initialData,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {isLocked, isLoading:isLockLoading} = useApplicationLock()

  const registerEmploymentHistoryMutation = useCreateEmploymentHistory()

  // Format initialData - employment history comes as array
  const formattedInitialData = {
    items:
      initialData?.length > 0
        ? initialData.map((item: any) => ({
            address: item.address || '',
            status: item.status || '',
            startDate: item.startDate?.split('T')[0] || '',
            organisation: item.organisation || '',
            positionHeld: item.positionHeld || '',
          }))
        : [
            {
              address: '',
              status: '',
              startDate: '',
              organisation: '',
              positionHeld: '',
            },
          ],
  }

  const form = useForm<z.infer<typeof employmentHistorySubmitSchema>>({
    resolver: zodResolver(employmentHistorySubmitSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData,
  })

  const { isValid, isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (initialData?.length > 0) {
      const updatedData = {
        items: initialData.map((item: any) => ({
          address: item.address || '',
          status: item.status || '',
          startDate: item.startDate?.split('T')[0] || '',
          organisation: item.organisation || '',
          positionHeld: item.positionHeld || '',
        })),
      }
      form.reset(updatedData)
    }
  }, [initialData])

  const isFormEmpty = formattedInitialData.items[0]?.organisation ? true : false

  function onSubmit(data: z.infer<typeof employmentHistorySubmitSchema>) {
    setIsLoading(true)

    if (isFormEmpty && !isDirty) {
      setIsLoading(false)
      handleNext()
      return
    }

    registerEmploymentHistoryMutation.mutate(
      { employmentHistory: data.items },
      {
        onSuccess: () => {
          setIsLoading(false)
          toast.success(`Employment History saved successfully!`)
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('employment history error:', error)
          toast.error('Failed to save Employment History. Please try again.')
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
            Current Employment
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            Please fill out all fields.
          </h4>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className='bg-background space-y-4 rounded-lg border border-gray-200 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Employment {index + 1}</p>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-xs text-red-500 hover:text-red-600'
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`items.${index}.organisation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Organisation Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Organisation Name'
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
                name={`items.${index}.positionHeld`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Position Held <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Position'
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
                name={`items.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Address <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Address of the organization'
                        {...field}
                        className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex space-x-4'>
                <FormField
                  control={form.control}
                  name={`items.${index}.status`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm font-medium text-gray-700'>
                        Status <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='mt-[12px] w-full rounded-[12px]'>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='full_time'>Full Time</SelectItem>
                          <SelectItem value='part_time'>Part Time</SelectItem>
                          <SelectItem value='contract'>Contract</SelectItem>
                          <SelectItem value='self_employed'>
                            Self Employed
                          </SelectItem>
                          <SelectItem value='unemployed'>Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm font-medium text-gray-700'>
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
              </div>
            </div>
          ))}

          <Button
            type='button'
            variant='ghost'
            onClick={() =>
              append({
                organisation: '',
                positionHeld: '',
                address: '',
                status: '',
                startDate: '',
              })
            }
            className='text-mainGreen hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Employment
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

export default EmploymentHistory
