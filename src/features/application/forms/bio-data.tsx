import { useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bioDataSchema, bioDataSubmitSchema } from '@/schemas/application'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import nigeriaData from '@/assets/statesAndLGA/nigeria-state-and-lgas.json'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { formatNigerianPhoneNumberWithCode } from '@/utils/phoneFormatter'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const useCreateBioData = createPostMutationHook({
  endpoint: '/applications',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function BioData({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
  initialData,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const registerBioDataMutation = useCreateBioData()

  const form = useForm<z.infer<typeof bioDataSchema>>({
    resolver: zodResolver(bioDataSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          ...initialData,
          dob: initialData.dob
            ? new Date(initialData.dob).toISOString().split('T')[0]
            : '',
        }
      : {},
  })

  const { isValid, isDirty } = form.formState

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        dob: initialData.dob
          ? new Date(initialData.dob).toISOString().split('T')[0]
          : '',
      }
      form.reset(formattedData)
    }
  }, [initialData, form])

  // Watch for state changes and validate LGA
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'state' || (name === undefined && values.state)) {
        const currentState = values.state
        const currentLga = values.lga

        if (currentState && currentLga) {
          const stateData = nigeriaData.find(
            (item) => item.state === currentState
          )
          const isValidLga = stateData?.lgas?.includes(currentLga)

          if (!isValidLga) {
            form.setValue('lga', '', { shouldDirty: true })
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  function onSubmit(data: z.infer<typeof bioDataSchema>) {
    setIsLoading(true)
    const formattedData = {
      ...data,
      phoneNumber: formatNigerianPhoneNumberWithCode(data.phoneNumber),
    }

    if (initialData && !isDirty) {
      // when i want to move to next step without changes
      setIsLoading(false)
      handleNext()
      return
    }

    // Validate against API schema
    const validatedApiData = bioDataSubmitSchema.parse(formattedData)

    registerBioDataMutation.mutate(
      { bioData: validatedApiData },
      {
        onSuccess: () => {
          setIsLoading(false)
          toast.success(`Bio-Data saved successfully!`)
          handleNext()
        },
        onError: (error) => {
          console.error('bio data error:', error)
          setIsLoading(false)
          toast.error('Failed to save Bio-Data. Please try again.')
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
  // if (status === 'error') return <div>Could not load bio data.</div>;

  console.log(initialData)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p className='font-montserrat text-active font-normal italic'>
          Step {step}
        </p>

        <div className='space-y-6'>
          {/* Header */}
          <header>
            <h2 className='font-montserrat mb-1 text-xl font-semibold text-gray-800'>
              Bio-Data
            </h2>
            <h4 className='font-montserrat text-md text-active font-normal'>
              Please fill out all fields.
            </h4>
          </header>

          {/* First Name */}

          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  First Name <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter first name'
                    {...field}
                    className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2 capitalize'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Last Name <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter last name'
                    {...field}
                    className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2 capitalize'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='otherNames'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Other Names
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter other names'
                    {...field}
                    className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2 capitalize'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='previousNames'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Previous Names (if name has changed) with Date
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter previous names'
                    {...field}
                    className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2 capitalize'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Info */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='block text-sm font-medium text-gray-700'>
                    Email <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter email'
                      {...field}
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
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
                    Phone Number <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter phone number'
                      {...field}
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Nationality */}
          <FormField
            control={form.control}
            name='nationality'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Nationality <span className='text-red-500'>*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='mt-2 w-full rounded-[12px]'>
                      <SelectValue placeholder='Select Nationality' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Nigerian'>Nigerian</SelectItem>
                    <SelectItem value='American'>American</SelectItem>
                    <SelectItem value='British'>British</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              {/* State of Origin */}
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      State <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='mt-2 w-full rounded-[12px]'>
                          <SelectValue placeholder='Select State' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nigeriaData.map((item, index) => (
                          <SelectItem key={index} value={item.state}>
                            {item.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              {/* LGA */}
              <FormField
                control={form.control}
                name='lga'
                render={({ field }) => {
                  const formValues = form.getValues()
                  const selectedState = formValues.state
                  const lgaList =
                    nigeriaData.find((item) => item.state === selectedState)
                      ?.lgas || []
                  return (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium text-gray-700'>
                        LGA <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedState}
                        key={selectedState} // Force re-render when state changes
                      >
                        <FormControl>
                          <SelectTrigger className='mt-2 w-full rounded-[12px]'>
                            <SelectValue
                              placeholder={
                                selectedState
                                  ? 'Select LGA'
                                  : 'Select State First'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lgaList.map((lga, index) => (
                            <SelectItem key={index} value={lga}>
                              {lga}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>

          {/* DOB & Gender */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Date of Birth <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              {/* Gender */}
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>
                      Gender <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='mt-2 w-full rounded-[12px]'>
                          <SelectValue placeholder='Select Gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Male'>Male</SelectItem>
                        <SelectItem value='Female'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
                (initialData ? !isDirty : !isValid))
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

export default BioData
