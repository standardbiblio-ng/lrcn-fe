import { useState, useEffect } from 'react'
import z from 'zod'
import axios from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { documentsSubmitSchema } from '@/schemas/application'
import { StepperProps } from '@/types/stepper.type'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const useUpdateDocument = createPostMutationHook({
  endpoint: '/applications',
  requestSchema: z.any(),
  responseSchema: z.any(),
  requiresAuth: true,
})

function Upload({
  handleBack,
  handleNext,
  step,
  lastCompletedStep,
  initialData,
}: StepperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileObjects, setFileObjects] = useState<{ [key: number]: File }>({})
  const [filePreviews, setFilePreviews] = useState<{ [key: number]: string }>(
    {}
  )

  const updateDocumentMutation = useUpdateDocument()
  const { auth } = useAuthStore()

  // Format initialData for form
  const formattedInitialData =
    initialData?.length > 0
      ? {
          items: initialData.map((doc: any) => ({
            name: doc.name || '',
            fileKey: doc.fileKey || '',
            fileType: doc.fileType || '',
            uploadedAt: doc.uploadedAt?.split('T')[0] || '',
            fileUrl: doc.fileUrl || '',
          })),
        }
      : {
          items: [
            {
              name: '',
              fileKey: '',
              fileType: '',
              uploadedAt: '',
            },
          ],
        }

  const form = useForm<z.infer<typeof documentsSubmitSchema>>({
    resolver: zodResolver(documentsSubmitSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData,
  })

  const { control, formState, setValue, watch, reset } = form
  const { isValid, isDirty } = formState

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items',
  })

  // Reset form when initialData changes (e.g., after page refresh)
  useEffect(() => {
    if (initialData?.length > 0) {
      reset(formattedInitialData)
    }
  }, [initialData, reset])

  // Watch all docs for dynamic rendering
  const items = watch('items')
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
      // Store the actual file object
      setFileObjects((prev) => ({ ...prev, [index]: file }))

      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file)
      setFilePreviews((prev) => ({ ...prev, [index]: previewUrl }))

      setValue(`items.${index}.fileType`, file.type, {
        shouldDirty: true,
      })
      setValue(`items.${index}.fileKey`, 'pending', {
        shouldDirty: true,
      })
    }
  }

  // Remove specific file
  const removeFile = (index: number) => {
    // Clean up preview URL
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index])
    }

    // Remove from state
    setFileObjects((prev) => {
      const updated = { ...prev }
      delete updated[index]
      return updated
    })
    setFilePreviews((prev) => {
      const updated = { ...prev }
      delete updated[index]
      return updated
    })

    setValue(`items.${index}.fileKey`, '', { shouldDirty: true })
    setValue(`items.${index}.fileType`, '', { shouldDirty: true })
  }

  const uploadFile = async (file: File) => {
    // Create FormData and append file
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      )

      return response.data.key
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  async function onSubmit(data: z.infer<typeof documentsSubmitSchema>) {
    setIsLoading(true)

    if (!isDirty) {
      // when i want to move to next step without changes
      setIsLoading(false)
      handleNext()
      return
    }

    try {
      // Upload all files and get their keys
      const uploadPromises = data.items.map(async (item, index) => {
        const file = fileObjects[index]

        // If there's a file to upload (fileKey is 'pending'), upload it
        if (file && item.fileKey === 'pending') {
          const key = await uploadFile(file)
          return {
            ...item,
            fileKey: key,
            uploadedAt: new Date().toISOString().split('T')[0],
          }
        }

        // If no file or already has a key, return as is
        return item
      })

      const itemsWithKeys = await Promise.all(uploadPromises)

      // Now submit to backend with actual file keys
      updateDocumentMutation.mutate(
        { documents: itemsWithKeys },
        {
          onSuccess: () => {
            setIsLoading(false)
            toast.success(`Documents saved successfully!`)
            handleNext()
          },
          onError: (error) => {
            setIsLoading(false)
            console.error('documents upload error:', error)
            toast.error('Failed to save documents. Please try again.')
          },
        }
      )
    } catch (error) {
      setIsLoading(false)
      console.error('File upload error:', error)
      toast.error('Failed to upload files. Please try again.')
    }
  }

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

          {/* {items.map((doc, index) => ( */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='bg-background space-y-4 rounded-lg border border-gray-200 p-4'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Document {index + 1}</p>
                {items.length > 1 && (
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

              {/* Document Type */}

              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm'>
                      Document type <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='mt-[12px] w-full rounded-[12px]'>
                          <SelectValue placeholder='Select document type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(documentTypes).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document upload + preview */}
              <div>
                <label className='mb-2 block text-sm'>
                  Document <span className='text-red-500'>*</span>
                </label>
                <div
                  className={`bg-neutral2 relative mt-[12px] flex h-[150px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border lg:h-[200px]`}
                  style={{
                    backgroundImage: filePreviews[index]
                      ? `url(${filePreviews[index]})`
                      : items[index]?.fileUrl
                        ? `url(${items[index].fileUrl})`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!filePreviews[index] && !items[index]?.fileUrl && (
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

                  {(filePreviews[index] || items[index]?.fileUrl) && (
                    <Button
                      onClick={() => removeFile(index)}
                      type='button'
                      size='sm'
                      variant='secondary'
                      className='absolute top-2 right-2 bg-black/50 text-xs text-white hover:bg-black/70'
                    >
                      Remove
                    </Button>
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
                fileKey: '',
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
            disabled={isLoading}
            className='bg-mainGreen hover:bg-blue-700'
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Upload
