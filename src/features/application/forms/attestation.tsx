import React, { useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { attestationSchema } from '@/schemas/attestation'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import nigeriaCoat from '@/assets/images/Nigeria-Coat.jpg'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { useAcademicHistoryStore } from '@/stores/academic-history-store'
import { useAttestationStore } from '@/stores/attestation-store'
import { useBioDataStore } from '@/stores/bio-data-store'
import { useEmploymentHistoryStore } from '@/stores/employment-history-store'
import { useRecommendationStore } from '@/stores/recommendation-store'
import { useUploadDocumentStore } from '@/stores/upload-store'
import { Form } from '@/components/ui/form'

const useGetAttestation = createGetQueryHook({
  endpoint: '/applications/my/attestation',
  responseSchema: z.any(),
  queryKey: ['my-attestation'],
})

const usePostAttestation = createPostMutationHook({
  endpoint: '/applications/my/attestation',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})
function Attestation({ handleBack, handleNext }: StepperProps) {
  // const [attest, setAttest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: prevAttestation, status } = useGetAttestation()
  const attestationMutation = usePostAttestation()
  const { formData, setFormData, initialized, markInitialized } =
    useAttestationStore()

  const form = useForm<z.infer<typeof attestationSchema>>({
    resolver: zodResolver(attestationSchema),
    mode: 'onChange',
    defaultValues: formData,
  })
  const { register } = form

  // ✅ Initialize store once from API
  useEffect(() => {
    if (prevAttestation && !initialized) {
      setFormData(prevAttestation)
      form.reset(prevAttestation)
      markInitialized()
    }
  }, [prevAttestation])

  const onSubmit = (data: z.infer<typeof attestationSchema>) => {
    setIsLoading(true)

    attestationMutation.mutate(data, {
      onSuccess: (responseData) => {
        toast.success('Attestation recorded successfully!')
        setFormData(responseData)
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
  const alreadyAttested = !!formData?.agreed
  const { formData: bioData } = useBioDataStore()

  const { formData: academicData } = useAcademicHistoryStore()

  const { formData: employmentData } = useEmploymentHistoryStore()
  const { formData: recommendationData } = useRecommendationStore()
  const { formData: uploadData } = useUploadDocumentStore()
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-4'>
        {/* === HEADER SECTION === */}
        <div className='text-center'>
          <img
            src={nigeriaCoat}
            alt='Nigeria coat'
            className='mx-auto mb-4 h-24 w-24'
          />
          <h2 className='font-montserrat mb-1 text-2xl font-bold'>
            LIBRARIANS' REGISTRATION COUNCIL OF NIGERIA (LRCN)
          </h2>
          <p>Veterinary Council of Nigeria Building,</p>
          <p>No. 8, Zambezi Crescent Maitama, P.M.B 5555 Garki, Abuja</p>
          <p>Tel: 08130000149 | Email: lrcn.info@yahoo.com</p>
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
                <td>{bioData?.firstName}</td>
              </tr>
              <tr className='border-b'>
                <td className='font-medium'>Last Name</td>
                <td>{bioData?.lastName}</td>
              </tr>
              {bioData?.otherNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Other Name</td>
                  <td>{bioData?.otherNames}</td>
                </tr>
              )}

              {bioData?.previousNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Previous Name</td>
                  <td>{bioData?.previousNames}</td>
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
                <td>{bioData?.dob}</td>
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
              {academicData.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Institution</td>
                    <td>{item.institution}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Qualification</td>
                    <td>{item.qualification}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Start – End Date</td>
                    <td>{item.startDate + ' – ' + item.endDate}</td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < academicData.items.length - 1 && (
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
              <tr className='border-b'>
                <td className='w-1/2 font-medium'>Employer</td>
                <td>{employmentData?.employer}</td>
              </tr>
              <tr className='border-b'>
                <td className='font-medium'>Address</td>
                <td>{employmentData?.address}</td>
              </tr>
              <tr className='border-b'>
                <td className='font-medium'>Status</td>
                <td>{employmentData?.status}</td>
              </tr>
              <tr className='border-b'>
                <td className='font-medium'>Start Date</td>
                <td>{employmentData?.startDate}</td>
              </tr>
            </tbody>
          </table>

          <h4 className='text-mainGreen mt-4 mb-2 font-semibold'>
            Work Experience
          </h4>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b font-semibold'>
                <th>Organization</th>
                <th>Start Date</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {employmentData.workExperience.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td>{item.organisation}</td>
                    <td>{item.startDate}</td>
                    <td>{item.positionHeld}</td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < employmentData.workExperience.length - 1 && (
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

        {/* === RECOMMENDATIONS === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Recommendation
          </h3>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b font-semibold'>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{recommendationData.name}</td>
                <td>{recommendationData.email}</td>
                <td>{recommendationData.phoneNumber}</td>
              </tr>
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
              {uploadData.documents.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Document Type</td>
                    <td>{item.name}</td>
                  </tr>
                  <tr>
                    <td className='font-medium'>File Upload</td>
                    <td>{item.fileType}</td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < uploadData.documents.length - 1 && (
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
          <input
            type='checkbox'
            {...register('agreed')}
            id='agreed'
            className='accent-mainGreen mt-1 h-5 w-5'
          />
          <label htmlFor='agreed' className='text-sm leading-6'>
            I hereby certify that the information provided above is true and
            correct to the best of my knowledge.
          </label>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className='mt-8 flex justify-between'>
          <button
            type='button'
            onClick={handleBack}
            disabled={isLoading}
            className='rounded border bg-white px-4 py-2 hover:bg-gray-50'
          >
            Back
          </button>
          <button
            type={alreadyAttested ? 'button' : 'submit'}
            onClick={() => {
              if (alreadyAttested) handleNext()
            }}
            disabled={isLoading || (!alreadyAttested && !form.watch('agreed'))}
            className={`bg-mainGreen rounded px-4 py-2 text-white transition hover:bg-green-700 ${
              (isLoading || (!alreadyAttested && !form.watch('agreed'))) &&
              'cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </Form>
  )
}

export default Attestation
