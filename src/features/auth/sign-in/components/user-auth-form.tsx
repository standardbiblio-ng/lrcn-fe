import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  loginRequestSchema,
  loginResponseSchema,
  userRequestSchema,
} from '@/schemas/userSchema'
import { Loader2, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createPostMutationHook } from '@/api/hooks/usePost'
import { useAuthStore } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

const useLogin = createPostMutationHook({
  endpoint: '/auth/login',
  requestSchema: loginRequestSchema,
  responseSchema: loginResponseSchema,
  requiresAuth: false,
})

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  // console.log('Auth store state:', auth)

  const loginMutation = useLogin()

  const form = useForm<z.infer<typeof userRequestSchema>>({
    resolver: zodResolver(userRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof userRequestSchema>) {
    // console.log('Submitting', { data })

    setIsLoading(true)

    loginMutation.mutate(data, {
      onSuccess: async (responseData) => {
        setIsLoading(false)

        // ✅ Use setAuthData with actual API response
        auth.setAuthData({
          access_token: responseData.access_token,
          user: responseData.user,

          // Add these when your API returns them:
          // refresh_token: responseData.refresh_token,
          // expires_in: responseData.expires_in
        })

        // queryClient.invalidateQueries({
        //   queryKey: [
        //     'my-bio-data',
        //     'my-acad-history',
        //     'my-attestation',
        //     'my-employment-history',
        //     'my-recommendations',
        //     'my-documents',
        //   ],
        // })
        // refetch all queries:
        await queryClient.refetchQueries()
        // ⏳ Auth state is now updated; proceed to redirect

        // Redirect to the stored location or default to dashboard
        const targetPath = redirectTo || '/dashboard'
        navigate(targetPath, { replace: true })

        toast.success(`Welcome back, ${data.email}!`)
      },
      onError: (error) => {
        console.error('Login error:', error)
        setIsLoading(false)
        toast.error('Login failed. Please check your credentials.')
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
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
