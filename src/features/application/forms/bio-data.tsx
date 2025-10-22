import { useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bioDataSchema, submitBioDataApiSchema } from '@/schemas/bioData'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import nigeriaData from '@/assets/statesAndLGA/nigeria-state-and-lgas.json'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { createPutMutationHook } from '@/api/hooks/usePut'
import { formatNigerianPhoneNumber } from '@/utils/phoneFormatter'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const useGetBioData = createGetQueryHook({
  endpoint: '/applications/my/bio-data',
  responseSchema: z.any(),
  queryKey: ['my-application'],
})

const useCreateBioData = createPostMutationHook({
  endpoint: '/applications/my/bio-data',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

const useUpdateBioData = createPutMutationHook({
  endpoint: '/applications/my/bio-data',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function BioData() {
  const [isLoading, setIsLoading] = useState(false)

  const { data: prevBioData } = useGetBioData()
  const registerBioDataMutation = useCreateBioData()
  const updateBioDataMutation = useUpdateBioData()

  const form = useForm<z.infer<typeof bioDataSchema>>({
    resolver: zodResolver(bioDataSchema),
    defaultValues: {
      firstName: prevBioData?.firstName || '',
      lastName: prevBioData?.lastName || '',
      otherNames: prevBioData?.otherNames || '',
      previousNames: prevBioData?.previousNames || '',
      email: prevBioData?.email || '',
      phoneNumber: prevBioData?.phoneNumber || '',
      nationality: prevBioData?.nationality || '',
      state: prevBioData?.state || '',
      lga: prevBioData?.lga || '',
      dob: prevBioData?.dob || '',
      gender: prevBioData?.gender || '',
    },
  })

  function onSubmit(data: z.infer<typeof bioDataSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)
    const formattedData = {
      ...data,
      phoneNumber: formatNigerianPhoneNumber(data.phoneNumber),
    }
    // eslint-disable-next-line no-console
    // console.log('Submitting', { formattedData })

    // Validate against API schema (optional extra validation)
    const validatedApiData = submitBioDataApiSchema.parse(formattedData)

    if (prevBioData) {
      updateBioDataMutation.mutate(validatedApiData, {
        onSuccess: (responseData) => {
          setIsLoading(false)

          toast.success(`Updated Bio-Data Successfully! Please proceed.`)
        },
        onError: (error) => {
          console.error('bio data update error:', error)
          setIsLoading(false)
          toast.error('Failed to update Bio-Data. Please try again.')
        },
      })
    } else {
      registerBioDataMutation.mutate(validatedApiData, {
        onSuccess: (responseData) => {
          setIsLoading(false)

          toast.success(`Recorded Bio-Data Successfully! Please proceed.`)

          // move to the next step in the application process
        },
        onError: (error) => {
          console.error('bio data register error:', error)
          setIsLoading(false)
          toast.error('Failed to record Bio-Data. Please try again.')
        },
      })
    }
  }
  return (
    <Form {...form}>
      <form>
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

          {/* Names */}
          <div>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='block text-sm font-medium text-gray-700'>
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter first name'
                      {...field}
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='block text-sm font-medium text-gray-700'>
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter last name'
                      {...field}
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
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
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
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
                      className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Info */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
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
                        placeholder='Enter email'
                        {...field}
                        className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
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
          </div>

          {/* Nationality */}
          <FormField
            control={form.control}
            name='nationality'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='block text-sm font-medium text-gray-700'>
                  Nationality
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                  >
                    <option value=''>Select Nationality</option>
                    <option value='Nigerian'>Nigerian</option>
                    <option value='American'>American</option>
                    <option value='British'>British</option>
                  </select>
                </FormControl>
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
                      State
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                      >
                        <option value=''>Select State</option>
                        {nigeriaData.map((item, index) => (
                          <option key={index} value={item.state}>
                            {item.state}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                  const selectedState = form.watch('state')
                  const lgaList =
                    nigeriaData.find((item) => item.state === selectedState)
                      ?.lgas || []
                  return (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium text-gray-700'>
                        LGA
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={!selectedState}
                          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                        >
                          <option value=''>
                            {selectedState
                              ? 'Select LGA'
                              : 'Select State First'}
                          </option>
                          {lgaList.map((lga, index) => (
                            <option key={index} value={lga}>
                              {lga}
                            </option>
                          ))}
                        </select>
                      </FormControl>
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
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
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
                      Gender
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
                      >
                        <option value=''>Select Gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default BioData
