import { useEffect, useState } from 'react'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acadHistoryRequestSchema } from '@/schemas/acadHistory'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { createPutMutationHook } from '@/api/hooks/usePut'
import { useAcademicHistoryStore } from '@/stores/academic-history-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface Institution {
  institution: string
  qualification: string
  startDate: string
  endDate: string
}

const useGetAcadHist = createGetQueryHook({
  endpoint: '/applications/my/academic-history',
  responseSchema: z.any(),
  queryKey: ['my-acad-history'],
})

const useCreateAcadHist = createPostMutationHook({
  endpoint: '/applications/my/academic-history',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

const useUpdateAcadHist = createPutMutationHook({
  endpoint: '/applications/my/academic-history',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function AcademicHistory({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { data: prevAcadHist, error, status } = useGetAcadHist()
  // console.log('Status:', status)
  // console.log('Error:', error)
  // console.log('Data:', prevAcadHist)
  const registerAcadHistMutation = useCreateAcadHist()
  const updateAcadHistMutation = useUpdateAcadHist()

  const { formData, setFormData } = useAcademicHistoryStore()

  const form = useForm<z.infer<typeof acadHistoryRequestSchema>>({
    resolver: zodResolver(acadHistoryRequestSchema),
    mode: 'onChange',
    defaultValues: formData,
  })

  // ✅ Initialize store once from API
  useEffect(() => {
    if (prevAcadHist?.length > 0) {
      console.log('Fire the useEffect to set previous bio data in store')
      const formattedData = {
        items: prevAcadHist.map((record: Institution) => ({
          ...record,
          startDate: record.startDate.split('T')[0],
          endDate: record.endDate.split('T')[0],
        })),
      }

      console.log('Setting previous academic history in store + form')
      setFormData(formattedData)
      form.reset(formattedData) // 👈 this re-syncs React Hook Form with the updated store values
    }
  }, [prevAcadHist])

  const { isValid, isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  function onSubmit(data: z.infer<typeof acadHistoryRequestSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    if (prevAcadHist?.length > 0) {
      // console.log('Submitting for Updating', { formattedData })
      console.log('updating academic history....')
      // console.log('isDirty:', isDirty)
      if (!isDirty) {
        // when i want to move to next step without changes
        setIsLoading(false)
        handleNext()
        return
      }
      updateAcadHistMutation.mutate(data, {
        onSuccess: (responseData: any) => {
          setIsLoading(false)
          setFormData(responseData)
          toast.success(`Updated Academic History Successfully!`)
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('academic history update error:', error)

          toast.error('Failed to update Academic History. Please try again.')
        },
      })
    } else {
      // console.log('registering academic history....')
      registerAcadHistMutation.mutate(data, {
        onSuccess: (responseData: any) => {
          setIsLoading(false)

          setFormData(responseData)
          toast.success(`Recorded Academic History Successfully!`)

          // move to the next step in the application process
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('academic history register error:', error)

          toast.error('Failed to record Academic History. Please try again.')
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
            Academic History
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            List all tertiary institutions attended starting from the most
            recent.
          </h4>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className='space-y-4 rounded-lg border bg-gray-50 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='font-montserrat text-base font-bold'>
                  Tertiary Institution {index + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    onClick={() => remove(index)}
                    className='text-sm font-medium text-red-500 hover:underline'
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`items.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Institution
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter institution name'
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
                name={`items.${index}.qualification`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm'>
                      Qualification Obtained
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                      >
                        <option value=''>Select qualification</option>
                        <option value='BSc'>BSc</option>
                        <option value='MSc'>MSc</option>
                        <option value='PhD'>PhD</option>
                        <option value='HND'>HND</option>
                        <option value='OND'>OND</option>
                      </select>
                    </FormControl>
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

                <FormField
                  control={form.control}
                  name={`items.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='block text-sm'>End Date</FormLabel>
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

          <button
            type='button'
            onClick={() =>
              append({
                institution: '',
                qualification: '',
                startDate: '',
                endDate: '',
              })
            }
            className='text-mainGreen flex items-center font-medium hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Institution
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
                (prevAcadHist?.length > 0
                  ? !isDirty // Update: Only enable when form has changed
                  : !isValid)) // Next: Only enable when form is valid
            }
            className={`bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700 ${
              (isLoading ||
                (step !== lastCompletedStep &&
                  (prevAcadHist?.length > 0 ? !isDirty : !isValid))) &&
              'cursor-not-allowed opacity-50'
            }`}
          >
            {prevAcadHist?.length > 0 && lastCompletedStep !== step
              ? 'Update'
              : 'Next'}
          </button>
        </div>
      </form>
    </Form>
  )
}

export default AcademicHistory
