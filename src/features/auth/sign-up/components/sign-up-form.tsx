import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerUserApiSchema,
  registerUserRequestSchema,
  registerUserResponseSchema,
} from '@/schemas/userSchema'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { cn } from '@/lib/utils'
import { formatNigerianPhoneNumber } from '@/utils/phoneFormatter'
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
import { PasswordInput } from '@/components/password-input'

interface SignUpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

const useRegister = createPostMutationHook({
  endpoint: '/auth/register',
  requestSchema: registerUserApiSchema,
  responseSchema: registerUserResponseSchema,
  requiresAuth: false,
})

export function SignUpForm({
  className,
  redirectTo,
  ...props
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const registerMutation = useRegister()

  const form = useForm<z.infer<typeof registerUserRequestSchema>>({
    resolver: zodResolver(registerUserRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  })

  function onSubmit(data: z.infer<typeof registerUserRequestSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)
    const formattedData = {
      email: data.email,
      password: data.password,
      phoneNumber: formatNigerianPhoneNumber(data.phoneNumber),
    }
    // eslint-disable-next-line no-console
    // console.log('Submitting', { formattedData })

    // Validate against API schema (optional extra validation)
    const validatedApiData = registerUserApiSchema.parse(formattedData)

    registerMutation.mutate(validatedApiData, {
      onSuccess: (responseData) => {
        setIsLoading(false)

        // Redirect to the stored location or default to login
        const targetPath = redirectTo || '/auth/login'
        navigate(targetPath, { replace: true })

        toast.success(`Successful Registration! Please log in.`)
      },
      onError: (error) => {
        console.error('Registration error:', error)
        setIsLoading(false)
        toast.error('Registration failed. Please try again.')
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
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
                <Input placeholder='07**********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Create Account
        </Button>
      </form>
    </Form>
  )
}
