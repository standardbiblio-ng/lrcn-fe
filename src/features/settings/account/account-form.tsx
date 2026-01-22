import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '@/api'
import { toast } from 'sonner'
import {  useGetUserProfile } from '@/api/hooks/useGetData'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/gif',
]
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
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'File size must be less than 5MB'
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png, .webp and .gif formats are supported'
    ),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { data: profile } = useGetUserProfile()
  const { auth } = useAuthStore()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    values: {
      otherNames: profile?.otherNames || '',
      lastName: profile?.lastName || '',
      email: profile?.email ?? auth?.user?.email,
      phoneNumber: profile?.phoneNumber ?? auth?.user?.phoneNumber,
    },
  })

  console.log('Profile data in AccountForm:', profile)
  async function onSubmit(data: AccountFormValues) {
    const profilePicture = data.profilePicture

    try {
      const formData = new FormData()

      if (profilePicture) {
        formData.append('file', profilePicture)
      }
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )
        if (response.data) {
          queryClient.invalidateQueries({ queryKey: ['user-profile'] })

          toast.success('Profile updated successfully!')
        }
        return response
      } catch (error) {
        console.error('File upload error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-8 overflow-y-auto'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
          <FormField
            control={form.control}
            name='profilePicture'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <div className='relative my-4 h-40 w-40'>
                  <Avatar className='h-full w-full cursor-pointer rounded-full border border-gray-300'>
                    {field.value || profile?.profilePicture ? (
                      <AvatarImage
                        src={
                          field.value
                            ? URL.createObjectURL(field.value)
                            : profile?.profilePicture
                        }
                        alt='Profile Image'
                        className='h-full w-full rounded-full object-cover'
                      />
                    ) : (
                      <AvatarFallback className='bg-background text-foreground flex items-center justify-center rounded-full text-3xl'>
                        {profile?.email[0]?.toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className='bg-foreground absolute top-1 left-1 mt-2 flex items-center justify-center rounded-full p-1 shadow-md'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-gray-700'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 7h2l2-3h10l2 3h2v14H3V7zM12 11a4 4 0 100 8 4 4 0 000-8z'
                      />
                    </svg>
                  </div>
                  <input
                    type='file'
                    accept='image/jpeg,image/png,image/webp,image/jpg,image/gif'
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        if (file.size > MAX_FILE_SIZE) {
                          toast.error('File size must be less than 5MB')
                          event.target.value = ''
                          return
                        }
                        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                          toast.error('Only .jpg, .jpeg, .png, .webp and .gif formats are supported')
                          event.target.value = ''
                          return
                        }
                      }
                      field.onChange(file)
                    }}
                    className='absolute top-0 left-0 h-full w-full cursor-pointer rounded-full opacity-0'
                  />
                </div>
                <FormMessage />
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
                    disabled
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
                    disabled
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
                  disabled
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
                <Input placeholder='Your phone number' {...field} disabled />
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
