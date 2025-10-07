import { z } from 'zod'
import {
  useMutation,
  UseMutationResult,
  QueryClient,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { axiosInstance } from '../config'

// import { useAuthStore } from 'src/store/auth.store'

interface CreatePatchMutationHookArgs<
  RequestSchema extends z.ZodType,
  ResponseSchema extends z.ZodType,
> {
  /** The endpoint for the PATCH request */
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
  requiresAuth?: boolean
}

/**
 * Create a custom hook for performing PATCH requests with react-query and Zod validation
 *
 * @example
 * const useUpdateUser = createPatchMutationHook({
 *   endpoint: '/api/users/:id',
 *   requestSchema: updateUserSchema,
 *   responseSchema: userSchema,
 * });
 *
 * const { mutate, data } = useUpdateUser({ id: '123' });
 * mutate({ name: 'John', email: 'john@example.com' });
 */
export function createPatchMutationHook<
  RequestSchema extends z.ZodType,
  ResponseSchema extends z.ZodType,
  RouteParams extends Record<string, string | number | undefined> = Record<
    string,
    never
  >,
>({
  endpoint,
  requestSchema,
  responseSchema,
  mutationOptions,
  onSuccess,
  onError,
  onSettled,
  requiresAuth = true,
}: CreatePatchMutationHookArgs<RequestSchema, ResponseSchema>) {
  return (routeParams?: RouteParams) => {
    const queryClient = new QueryClient()

    const mutationFn = async (data: z.infer<RequestSchema>) => {
      // Handle route parameters
      let url = endpoint
      if (routeParams) {
        url = Object.entries(routeParams).reduce(
          (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
          endpoint
        )
      }

      // const { accessToken } = useAuthStore.getState()
      const { auth } = useAuthStore()
      const validatedData = requestSchema.parse(data)
      const headers = requiresAuth
        ? { Authorization: `Bearer ${auth.accessToken}` }
        : {}
      return axiosInstance
        .patch(url, validatedData, { headers })
        .then((response: { data: unknown }) => {
          console.log('Raw response:', response)
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
      onSuccess: (data, variables) => onSuccess?.(data, variables, queryClient),
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
