import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBioDataStore } from '@/stores/bio-data-store'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { formatNigerianPhoneNumberWithCode } from '@/utils/phoneFormatter'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
const accountFormSchema = z.object({
  otherNames: z
    .string()
    .min(1, 'Please enter your other names.')
    .min(2, 'Other names must be at least 2 characters.')
    .max(30, 'Other names must not be longer than 30 characters.'),
  lastName: z
    .string()
    .min(1, 'Please enter your last name.')
    .min(2, 'Last name must be at least 2 characters.')
    .max(30, 'Last name must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  phoneNumber: z.string().min(1, 'Please enter your phone number.'),

  profileImage: z.custom<File | undefined >()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE,
    "Image must be less than 2MB") 
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only JPG, PNG or WEBP images are allowed"
  )
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
// const defaultValues: Partial<AccountFormValues> = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   phoneNumber: '',
// }

export function AccountForm() {

  const { formData: bioData } = useBioDataStore()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      otherNames: bioData.otherNames || '',
      lastName: bioData.lastName || '',
      email: bioData.email || '',
      phoneNumber: formatNigerianPhoneNumberWithCode(bioData.phoneNumber) || '', 
    },
  })
  //const profileImg = form.watch('profileImage')
  //const [previewImage, setPreviewImage] = useState<string | null>(null)

  /* useEffect(() => {
    if (profileImg) {
      const url = URL.createObjectURL(profileImg)
      setPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewImage(null)
    }
  }, [profileImg]) */

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8 overflow-y-auto'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
        <FormField
        control={form.control}
        name='profileImage'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
             <div className='relative w-40 h-40 my-4'>
           <Avatar className='h-full w-full rounded-full cursor-pointer border border-gray-300'>
             {field.value ? (<AvatarImage src={URL.createObjectURL(field.value)} alt='Profile Image' 
             className='h-full w-full object-cover rounded-full'/>
             ): (
              <AvatarFallback className='bg-background text-foreground flex items-center justify-center text-3xl rounded-full'>
              {bioData.email[0]?.toUpperCase()}
             </AvatarFallback>
             )}
             
           </Avatar>
           <div className="absolute top-1 left-1 bg-foreground rounded-full p-1 mt-2 shadow-md flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7h2l2-3h10l2 3h2v14H3V7zM12 11a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  </div>
             <input type="file"
              accept='image/*'
              onChange={(event) => {
                const file = event.target.files?.[0]
                field.onChange(file)
              }} 
              className='absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer rounded-full'
              />
          </div>
            <FormMessage/>
          </FormItem>
        )}
        />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Your Surname'
                    {...field}
                    className='capitalize'
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
                <FormLabel>Other Names</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Your other names'
                    {...field}
                    className='capitalize'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Your email address'
                  {...field}
                  className='flex-1'
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='Your phone number' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update account</Button>
      </form>
    </Form>
  )
}
