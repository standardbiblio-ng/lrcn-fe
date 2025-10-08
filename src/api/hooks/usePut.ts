import { z } from 'zod'
import {
  useMutation,
  UseMutationResult,
  QueryClient,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { axiosInstance } from '../config'

interface CreatePutMutationHookArgs<
  RequestSchema extends z.ZodType,
  ResponseSchema extends z.ZodType,
> {
  endpoint: string
  requestSchema: RequestSchema
  responseSchema: ResponseSchema
  mutationOptions?: Omit<
    UseMutationOptions<z.infer<ResponseSchema>, Error, z.infer<RequestSchema>>,
    'mutationFn'
  >
  onSuccess?: (
    data: z.infer<ResponseSchema>,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  onError?: (
    error: Error,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  onSettled?: (
    data: z.infer<ResponseSchema> | undefined,
    error: Error | null,
    variables: z.infer<RequestSchema>,
    queryClient: QueryClient
  ) => void
  /** Property to indicate if auth is required */
  requiresAuth?: boolean
}

export function createPutMutationHook<
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
}: CreatePutMutationHookArgs<RequestSchema, ResponseSchema>) {
  return (routeParams?: RouteParams) => {
    const queryClient = new QueryClient()

    const mutationFn = async (data: z.infer<RequestSchema>) => {
      let url = endpoint
      if (routeParams) {
        url = Object.entries(routeParams).reduce(
          (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
          endpoint
        )
      }

      const { auth } = useAuthStore()
      const validatedData = requestSchema.parse(data)
      const headers = requiresAuth
        ? { Authorization: `Bearer ${auth.accessToken}` }
        : {}

      return axiosInstance
        .put(endpoint, validatedData, { headers })
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
