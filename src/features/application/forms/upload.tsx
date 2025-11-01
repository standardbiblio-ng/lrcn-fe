import { useEffect, useState } from 'react'
import z, { set } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadSchema } from '@/schemas/uploadSchema'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createGetQueryHook } from '@/api/hooks/useGet'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { createPutMutationHook } from '@/api/hooks/usePut'
import { useUploadDocumentStore } from '@/stores/upload-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface DocumentType {
  type: string
  file: File | null
  preview: string | null
}

const useGetDocuments = createGetQueryHook({
  endpoint: '/applications/my/documents',
  responseSchema: z.any(),
  queryKey: ['my-documents'],
})

const useCreateDocument = createPostMutationHook({
  endpoint: '/applications/my/documents',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

const useUpdateDocument = createPutMutationHook({
  endpoint: '/applications/my/documents',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Upload({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { data: prevDocuments, error, status } = useGetDocuments()
  const registerDocumentMutation = useCreateDocument()
  const updateDocumentMutation = useUpdateDocument()

  const { formData, setFormData } = useUploadDocumentStore()

  // console.log('prevDocuments:', prevDocuments)

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    mode: 'onChange',
    defaultValues: formData,
  })

  // ✅ Initialize store once from API
  useEffect(() => {
    if (prevDocuments?.length > 0) {
      console.log(
        'Fire the useEffect to set previous documents upload in store'
      )
      const formattedData = {
        documents: prevDocuments.map((doc: any) => ({
          name: doc.name || '',
          fileUrl: doc.fileUrl || '',
          fileType: doc.fileType || '',
          uploadedAt: doc.uploadedAt?.split('T')[0] || '2025-10-28T12:00:00Z',
        })),
      }

      console.log('Setting previous documents upload in store + form')
      setFormData(formattedData)
      form.reset(formattedData) // 👈 this re-syncs React Hook Form with the updated store values
    }
  }, [prevDocuments])

  const { control, handleSubmit, formState, setValue, watch } = form
  const { isValid, isDirty } = formState

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  })

  // Watch all docs for dynamic rendering
  const documents = watch('documents')

  const documentTypes = {
    1: 'NYSC',
    2: 'BLIS',
    3: 'NLA Certificate',
  }

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setValue(`documents.${index}.fileUrl`, reader.result as string, {
          shouldDirty: true,
        })
        setValue(`documents.${index}.fileType`, file.type, {
          shouldDirty: true,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // // Remove specific file
  const removeFile = (index: number) => {
    setValue(`documents.${index}.fileUrl`, '', { shouldDirty: true })
    setValue(`documents.${index}.fileType`, '', { shouldDirty: true })
  }

  // Filter out already selected document types
  // const usedTypes = documents.map((doc) => doc.type)

  function onSubmit(data: z.infer<typeof uploadSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    if (prevDocuments?.length > 0) {
      // console.log('Submitting for Updating', { formattedData })
      console.log('updating documents upload....')
      // console.log('isDirty:', isDirty)
      if (!isDirty) {
        // when i want to move to next step without changes
        setIsLoading(false)
        handleNext()
        return
      }
      updateDocumentMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Updated documents upload Successfully!`)

          const formattedData = {
            documents: responseData.map((doc: any) => ({
              name: doc.name || '',
              fileUrl: doc.fileUrl || '',
              fileType: doc.fileType || '',
              uploadedAt:
                doc.uploadedAt?.split('T')[0] || '2025-10-28T12:00:00Z',
            })),
          }

          setFormData(formattedData)
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('documents upload update error:', error)

          toast.error('Failed to update documents upload. Please try again.')
        },
      })
    } else {
      // console.log('registering academic history....')
      registerDocumentMutation.mutate(data, {
        onSuccess: (responseData) => {
          setIsLoading(false)
          toast.success(`Recorded documents upload Successfully!`)

          const formattedData = {
            documents: responseData.map((doc: any) => ({
              name: doc.name || '',
              fileUrl: doc.fileUrl || '',
              fileType: doc.fileType || '',
              uploadedAt:
                doc.uploadedAt?.split('T')[0] || '2025-10-28T12:00:00Z',
            })),
          }

          setFormData(formattedData)

          // move to the next step in the application process
          handleNext()
        },
        onError: (error) => {
          setIsLoading(false)
          console.error('documents upload register error:', error)

          toast.error('Failed to record documents upload. Please try again.')
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
        <div className='space-y-4'>
          <h2 className='font-montserrat mb-1 text-xl font-semibold'>
            Upload Documents
          </h2>
          <h4 className='font-montserrat text-md text-active font-normal'>
            Please upload valid and required documents.
          </h4>

          {/* {documents.map((doc, index) => ( */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Document {index + 1}</p>
                {documents.length > 1 && (
                  <button
                    onClick={() => remove(index)}
                    className='text-xs font-medium text-red-500 hover:underline'
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Document Type */}

              <FormField
                control={form.control}
                name={`documents.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm'>
                      Document type
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
                      >
                        <option value=''>Select document type</option>
                        {Object.entries(documentTypes).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document upload + preview */}
              <div>
                <label className='mb-2 block text-sm'>Document</label>
                <div
                  className={`bg-neutral2 relative mt-[12px] flex h-[150px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border lg:h-[200px]`}
                  style={{
                    backgroundImage: documents[index]?.fileUrl
                      ? `url(${documents[index].fileUrl})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!documents[index]?.fileUrl && (
                    <span className='text-sm text-gray-500'>
                      Click to upload document
                    </span>
                  )}

                  <input
                    type='file'
                    accept='image/*,.pdf'
                    onChange={(e) => handleFileChange(index, e)}
                    className='absolute inset-0 cursor-pointer opacity-0'
                  />

                  {documents[index]?.fileUrl && (
                    <button
                      onClick={() => removeFile(index)}
                      type='button'
                      className='absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white'
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={() =>
              append({
                name: '',
                fileUrl: '',
                fileType: '',
                uploadedAt: '',
              })
            }
            className='text-mainGreen flex items-center font-medium hover:text-green-700'
          >
            <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
              +
            </span>
            Add Another Document
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
                (prevDocuments?.length > 0
                  ? !isDirty // Update: Only enable when form has changed
                  : !isValid)) // Next: Only enable when form is valid
            }
            className={`bg-mainGreen rounded px-4 py-2 text-white hover:bg-blue-700 ${
              (isLoading ||
                (step !== lastCompletedStep &&
                  (prevDocuments?.length > 0 ? !isDirty : !isValid))) &&
              'cursor-not-allowed opacity-50'
            }`}
          >
            {prevDocuments?.length > 0 && lastCompletedStep !== step
              ? 'Update'
              : 'Next'}
          </button>
        </div>
      </form>
    </Form>
  )
}

export default Upload
