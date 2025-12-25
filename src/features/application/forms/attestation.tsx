import React, { useEffect, useState } from 'react'
import z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { attestationSchema, EmploymentHistoryItem } from '@/schemas/application'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import logo from '@/assets/images/LOGO.png'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'

const usePostAttestation = createPostMutationHook({
  endpoint: '/applications',
  requestSchema: z.object({ attestation: attestationSchema }),
  responseSchema: z.any(),
  requiresAuth: true,
})
function Attestation({ handleBack, handleNext, initialData }: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const attestationMutation = usePostAttestation()

  // Extract all form data from initialData
  const attestationData = initialData?.attestation || {}
  const bioData = initialData?.bioData || {}
  const academicData = initialData?.academicHistory || []
  const employmentData = initialData?.employmentHistory || []
  const recommendationData = initialData?.recommendations || []
  const uploadData = initialData?.documents || []

  // Utility function to extract filename from fileKey (format: "693fdbb7a0f215cd54e3685f/filename.pdf")
  const getFilenameFromKey = (fileKey: string): string => {
    if (!fileKey) return 'No file'
    const parts = fileKey.split('/')
    return parts.length > 1 ? parts[parts.length - 1] : fileKey
  }

  const form = useForm<z.infer<typeof attestationSchema>>({
    resolver: zodResolver(attestationSchema),
    mode: 'onChange',
    defaultValues: {
      agreed: attestationData?.agreed || false,
    },
  })
  const { watch } = form

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (initialData?.attestation) {
      form.reset({
        agreed: attestationData?.agreed || false,
      })
    }
  }, [initialData])

  const onSubmit = (data: z.infer<typeof attestationSchema>) => {
    setIsLoading(true)

    attestationMutation.mutate({ attestation: data } as any, {
      onSuccess: () => {
        toast.success('Attestation recorded successfully!')
        setIsLoading(false)
        handleNext()
      },
      onError: (error) => {
        console.error('Attestation submission error:', error)
        toast.error('Failed to record attestation. Please try again.')
        setIsLoading(false)
      },
    })
  }

  const alreadyAttested = !!attestationData?.agreed
  const isAgreed = watch('agreed')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-4'>
        {/* === HEADER SECTION === */}
        <div className='text-center'>
          <img
            src={logo}
            alt='Nigeria coat'
            className='mx-auto mb-4 h-24 w-24'
          />
          <h2 className='font-montserrat mb-1 text-2xl font-bold'>
            LIBRARIANS' REGISTRATION COUNCIL OF NIGERIA (LRCN)
          </h2>
          {/* <p>Veterinary Council of Nigeria Building,</p> */}
          <p>
            LRCN, 2nd Floor, Stephen Oronsaya Building, Dusten Alhaj along Kubwa
            Road, Abuja.
          </p>
          <p>Tel: +234 (666) 888 0000 | Email: lrcn.gov@gmail.com</p>
          <p>Website: www.lrcn.gov.ng</p>
        </div>

        {/* === BIO DATA === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Bio Data Information
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              <tr className='border-b'>
                <td className='w-1/2 font-medium'>First Name</td>
                <td className='capitalize'>{bioData?.firstName}</td>
              </tr>
              <tr className='border-b'>
                <td className='font-medium'>Last Name</td>
                <td className='capitalize'>{bioData?.lastName}</td>
              </tr>
              {bioData?.otherNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Other Name</td>
                  <td className='capitalize'>{bioData?.otherNames}</td>
                </tr>
              )}

              {bioData?.previousNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Previous Name</td>
                  <td className='capitalize'>{bioData?.previousNames}</td>
                </tr>
              )}

              <tr className='border-b'>
                <td className='font-medium'>Email</td>
                <td>{bioData?.email}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Phone Number</td>
                <td>{bioData?.phoneNumber}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Nationality</td>
                <td>{bioData?.nationality}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>State of Origin</td>
                <td>{bioData?.state}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Local Government Area</td>
                <td>{bioData?.lga}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Date of Birth</td>
                <td>
                  {bioData?.dob
                    ? format(new Date(bioData.dob), 'yyyy-MM-dd')
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className='font-medium'>Gender</td>
                <td>{bioData?.gender}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* === ACADEMIC HISTORY === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Academic History
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {academicData?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Institution</td>
                    <td className='capitalize'>{item.institution}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Qualification</td>
                    <td>{item.qualification}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Start – End Date</td>
                    <td>
                      {item.startDate?.split('T')[0] +
                        ' – ' +
                        item.endDate?.split('T')[0]}
                    </td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < academicData.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* === EMPLOYMENT HISTORY === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Employment History
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {employmentData?.map(
                (each: EmploymentHistoryItem, index: number) => (
                  <React.Fragment key={index}>
                    <tr className='border-b'>
                      <td className='w-1/2 font-medium'>Organisation</td>
                      <td className='capitalize'>{each?.organisation}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Position Held</td>
                      <td className='capitalize'>{each?.positionHeld}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Address</td>
                      <td className='capitalize'>{each?.address}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Status</td>
                      <td>{each?.status}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Start Date</td>
                      <td>
                        {each?.startDate
                          ? format(new Date(each.startDate), 'yyyy-MM-dd')
                          : 'N/A'}
                      </td>
                    </tr>

                    {/* Add spacing between records */}
                    {index < employmentData.length - 1 && (
                      <tr>
                        <td colSpan={2}>
                          <div className='my-3 border-b border-dashed border-gray-300'></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </section>

        {/* === RECOMMENDATIONS === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Referees
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {recommendationData?.map((referee: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Name</td>
                    <td className='capitalize'>{referee.name}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Email</td>
                    <td>{referee.email}</td>
                  </tr>
                  <tr>
                    <td className='font-medium'>Phone</td>
                    <td>{referee.phoneNumber}</td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < recommendationData.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* === DOCUMENT UPLOADS === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Document Uploads
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {uploadData?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Document Type</td>
                    <td>{item.name}</td>
                  </tr>
                  <tr>
                    <td className='font-medium'>File Name</td>
                    <td className='break-all'>
                      {getFilenameFromKey(item.fileKey)}
                    </td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < uploadData.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* === ATTESTATION CHECKBOX === */}
        <div className='mt-6 flex items-start space-x-3 border-t pt-4'>
          <FormField
            control={form.control}
            name='agreed'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    id='agreed'
                    className='accent-mainGreen mt-1 h-5 w-5'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <label htmlFor='agreed' className='text-sm leading-6'>
            I hereby certify that the information provided above is true and
            correct to the best of my knowledge.
          </label>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className='mt-8 flex justify-between'>
          <Button
            type='button'
            variant='outline'
            onClick={handleBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type={alreadyAttested ? 'button' : 'submit'}
            onClick={() => {
              if (alreadyAttested) handleNext()
            }}
            disabled={isLoading || !isAgreed}
            className='bg-mainGreen hover:bg-green-700'
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Attestation
