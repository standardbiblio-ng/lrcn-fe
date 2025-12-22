import { z } from 'zod'
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryClient,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { axiosInstance } from '../config'

interface CreatePostMutationHookArgs<
  RequestSchema extends z.ZodType,
  ResponseSchema extends z.ZodType,
> {
  /** The endpoint for the POST request */
  endpoint: string
  /** The Zod schema for the request data */
  requestSchema: RequestSchema
  /** The Zod schema for the response data */
  responseSchema: ResponseSchema
  /** The mutation options for react-query */
  mutationOptions?: Omit<
    UseMutationOptions<z.infer<ResponseSchema>, Error, z.infer<RequestSchema>>,
    'mutationFn'
  >
  /** Callback function called on successful mutation */
  onSuccess?: (
    data: z.infer<ResponseSchema>,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  /** Callback function called on mutation error */
  onError?: (
    error: Error,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  /** Callback function called when mutation is settled (success or error) */
  onSettled?: (
    data: z.infer<ResponseSchema> | undefined,
    error: Error | null,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  /** Property to indicate if auth is required */
  requiresAuth?: boolean
}

/**
 * Create a custom hook for performing POST requests with react-query and Zod validation
 *
 * @example
 * const useCreateUser = createPostMutationHook({
 *   endpoint: '/api/users',
 *   requestSchema: createUserSchema,
 *   responseSchema: userSchema,
 *   requiresAuth: true
 * });
 *
 * const { mutate, data } = useCreateUser();
 * mutate({ name: 'John', email: 'john@example.com' });
 */

export function createPostMutationHook<
  RequestSchema extends z.ZodType,
  ResponseSchema extends z.ZodType,
>({
  endpoint,
  requestSchema,
  responseSchema,
  mutationOptions,
  onSuccess,
  onError,
  onSettled,
  requiresAuth = true,
}: CreatePostMutationHookArgs<RequestSchema, ResponseSchema>) {
  return () => {
    const queryClient = useQueryClient()
    const { auth } = useAuthStore()

    const mutationFn = async (data: z.infer<RequestSchema>) => {
      const validatedData = requestSchema.parse(data)

      // Include the token in the headers if required
      const headers = requiresAuth
        ? { Authorization: `Bearer ${auth.accessToken}` }
        : {}

      return axiosInstance
        .post(endpoint, validatedData, { headers })
        .then((response: { data: unknown }) => {
          return responseSchema.parse(response.data)
        })
        .catch((error: unknown) => {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.format())
            throw error
          }
          throw error
        })
    }

    return useMutation({
      mutationFn,
      onSuccess: (data, variables) => {
        // Invalidate my-application query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['my-application'] })
        onSuccess?.(data, variables, queryClient)
      },
      onError: (error, variables) =>
        onError?.(error as Error, variables, queryClient),
      onSettled: (data, error, variables) =>
        onSettled?.(data, error as Error | null, variables, queryClient),
      ...mutationOptions,
    }) as UseMutationResult<
      z.infer<ResponseSchema>,
      Error,
      z.infer<RequestSchema>
    >
  }
}
