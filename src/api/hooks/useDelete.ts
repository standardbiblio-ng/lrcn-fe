import { z } from 'zod'
import {
  useMutation,
  UseMutationResult,
  QueryClient,
} from '@tanstack/react-query'
import { axiosInstance } from '../config'

// type QueryKey = [string] | [string, Record<string, string | number | undefined>]

interface CreateDeleteMutationHookArgs<ResponseSchema extends z.ZodType> {
  endpoint: string
  responseSchema: ResponseSchema
  onSuccess?: (
    data: z.infer<ResponseSchema>,
    variables: void,
    context: unknown,
    queryClient: QueryClient
  ) => void
  onError?: (
    error: Error,
    variables: void,
    context: unknown,
    queryClient: QueryClient
  ) => void
  onSettled?: (
    data: z.infer<ResponseSchema> | undefined,
    error: Error | null,
    variables: void,
    context: unknown,
    queryClient: QueryClient
  ) => void
}

export function createDeleteMutationHook<
  ResponseSchema extends z.ZodType,
  RouteParams extends Record<string, string | number | undefined> = Record<
    string,
    never
  >,
  QueryParams extends Record<string, string | number | undefined> = Record<
    string,
    never
  >,
>({
  endpoint,
  responseSchema,
  onSuccess,
  onError,
  onSettled,
}: CreateDeleteMutationHookArgs<ResponseSchema>) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = new QueryClient()

    const mutationFn = async () => {
      // Handle route parameters
      let url = endpoint
      if (params?.route) {
        url = Object.entries(params.route).reduce(
          (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
          endpoint
        )
      }

      // Handle query parameters
      if (params?.query) {
        const query = new URLSearchParams()
        Object.entries(params.query).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return
          query.append(key, String(value))
        })
        if (query.toString()) {
          url += `?${query.toString()}`
        }
      }

      return axiosInstance
        .delete(url)
        .then((response: unknown) => responseSchema.parse(response))
        .catch((error: unknown) => {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.format())
          }
          throw error
        })
    }

    return useMutation({
      mutationFn,
      onSuccess: (data, variables, context) =>
        onSuccess?.(data, variables, context, queryClient),
      onError: (error, variables, context) =>
        onError?.(error, variables, context, queryClient),
      onSettled: (data, error, variables, context) =>
        onSettled?.(data, error, variables, context, queryClient),
    }) as UseMutationResult<z.infer<ResponseSchema>, Error, void>
  }
}
