import { useState } from 'react'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employmentHistoryRequestSchema } from '@/schemas/employHistory'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { createPutMutationHook } from '@/api/hooks/usePut'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const useGetEmploymentHistory = createGetQueryHook({
  endpoint: '/applications/my/employment-history',
  responseSchema: z.any(),
  queryKey: ['my-employment-history'],
})

const useCreateEmploymentHistory = createPostMutationHook({
  endpoint: '/applications/my/employment-history',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

const useUpdateEmploymentHistory = createPutMutationHook({
  endpoint: '/applications/my/employment-history',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function EmploymentHistory({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: prevEmploymentHistory,
    error,
    status,
  } = useGetEmploymentHistory()
  const registerEmploymentHistoryMutation = useCreateEmploymentHistory()
  const updateEmploymentHistoryMutation = useUpdateEmploymentHistory()

  // console.log('prevEmploymentHistory:', lastCompletedStep, step)

  const form = useForm<z.infer<typeof employmentHistoryRequestSchema>>({
    resolver: zodResolver(employmentHistoryRequestSchema),
    mode: 'onChange',
    defaultValues:
      prevEmploymentHistory?.length > 0
        ? {
            ...prevEmploymentHistory[0],
            startDate: prevEmploymentHistory[0].startDate?.split('T')[0] || '',
            workExperience: (prevEmploymentHistory[0].workExperience || []).map(
              (exp: any) => ({
                ...exp,
                startDate: exp.startDate?.split('T')[0] || '',
              })
            ),
          }
        : {
            employer: '',
            address: '',
            status: '',
            workExperience: [
              { organisation: '', positionHeld: '', startDate: '' },
            ],
          },
  })

  const { isValid, isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'workExperience', // ✅ corrected
  })

  function onSubmit(data: z.infer<typeof employmentHistoryRequestSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    if (prevEmploymentHistory?.length > 0) {
      // console.log('Submitting for Updating', { formattedData })
      // console.log('updating employment history....')
      // console.log('isDirty:', isDirty)
      if (!isDirty) {
        // when i want to move to next step without changes
        setIsLoading(false)
        handleNext()
        return
      }
      // updateEmploymentHistoryMutation.mutate(data, {
      registerEmploymentHistoryMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Updated Employment History Successfully!`)
          // handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error(' employment history update error:', error)

          toast.error('Failed to update Employment History. Please try again.')
        },
      })
    } else {
      // console.log('registering employment history....')
      registerEmploymentHistoryMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Recorded Employment History Successfully!`)

          // move to the next step in the application process
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('employment history register error:', error)

          toast.error('Failed to record Employment History. Please try again.')
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

        <div className='space-y-6'>
          <h2 className='font-montserrat mb-1 text-xl font-semibold'>
            Current Employment
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            Please fill out all fields.
          </h4>

          <FormField
            control={form.control}
            name='employer'
            render={({ field }) => (
              <FormItem>
                {/* className='block text-sm' */}
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Employer
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name of the employer'
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
            name='address'
            render={({ field }) => (
              <FormItem>
                {/* className='block text-sm' */}
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Address of the employer'
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
              name='status'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='block text-sm font-medium text-gray-700'>
                    Status
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                    >
                      <option value=''>Select status</option>
                      <option value='full_time'>Full Time</option>
                      <option value='part_time'>Part Time</option>
                      <option value='contract'>Contract</option>
                      <option value='self_employed'>Self Employed</option>
                      <option value='unemployed'>Unemployed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='block text-sm font-medium text-gray-700'>
                    Start Date
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

          {/* Work Experience Section */}
          <p className='font-montserrat text-base font-bold'>Work Experience</p>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Experience {index + 1}</p>
                {fields.length > 1 && (
                  <button
                    onClick={() => remove(index)}
                    className='text-xs font-medium text-red-500 hover:underline'
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`workExperience.${index}.organisation`}
                render={({ field }) => (
                  <FormItem>
                    {/* className='block text-sm' */}
                    <FormLabel className='block text-sm'>
                      Organisation Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Organisation Name'
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
                  name={`workExperience.${index}.positionHeld`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm'>
                        Position Held
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
                  name={`workExperience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm font-medium text-gray-700'>
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          className='bg-neutral2 mt-[12px] w-full flex-1 rounded-[12px] border px-2 py-2'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={() =>
              append({ organisation: '', positionHeld: '', startDate: '' })
            }
            className='text-mainGreen flex items-center font-medium hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Experience
          </button>
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
                (prevEmploymentHistory?.length > 0
                  ? !isDirty // Update: Only enable when form has changed
                  : !isValid)) // Next: Only enable when form is valid
            }
            className={`bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700 ${
              (isLoading ||
                (step !== lastCompletedStep &&
                  (prevEmploymentHistory?.length > 0 ? !isDirty : !isValid))) &&
              'cursor-not-allowed opacity-50'
            }`}
          >
            {prevEmploymentHistory?.length > 0 && lastCompletedStep !== step
              ? 'Update'
              : 'Next'}
          </button>
        </div>
      </form>
    </Form>
  )
}

export default EmploymentHistory
