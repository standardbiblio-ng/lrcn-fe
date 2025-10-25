import { z } from 'zod'
import {
  useQuery,
  type UseQueryResult,
  QueryClient,
} from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { axiosInstance } from '../config'
import { getQueryKey } from '../config/url'

// Define the ApiResponse interface
interface ApiResponse<T = unknown> {
  data: T
  // Add other common response fields if your API uses them
  // message?: string
  // status?: string
  // etc.
}

type QueryKey = [string] | [string, Record<string, string | number | undefined>]

interface CreateGetQueryHookArgs<ResponseSchema extends z.ZodType> {
  /** The endpoint for the GET request */
  endpoint: string
  /** The Zod schema for the response data */
  responseSchema: ResponseSchema
  /** The query key for react-query */
  queryKey: QueryKey
  /** Property to indicate if auth is required */
  requiresAuth?: boolean
  /** Additional query options */
  options?: {
    enabled?: boolean
    staleTime?: number
    cacheTime?: number
    refetchOnWindowFocus?: boolean
  }
}

export function createGetQueryHook<
  ResponseSchema extends z.ZodType,
  RouteParams extends Record<string, string | number | undefined> = Record<
    string,
    string | number | undefined
  >,
  QueryParams extends Record<string, string | number | undefined> = Record<
    string,
    string | number | undefined
  >,
>({
  endpoint,
  responseSchema,
  queryKey,
  requiresAuth = true,
  options,
}: CreateGetQueryHookArgs<ResponseSchema>) {
  return (
    params?: { query?: QueryParams; route?: RouteParams },
    callbacks?: {
      onSuccess?: (
        data: z.infer<ResponseSchema>,
        queryClient: QueryClient
      ) => void
      onError?: (error: Error, queryClient: QueryClient) => void
      onSettled?: (
        data: z.infer<ResponseSchema> | undefined,
        error: Error | null,
        queryClient: QueryClient
      ) => void
    }
  ) => {
    const queryFn = async () => {
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
      // const { auth } = useAuthStore()
      // Get token WITHOUT using a hook
      const token = useAuthStore.getState().auth?.accessToken
      // console.log('Using token:', token)

      // Include the token in the headers if required
      const headers = requiresAuth ? { Authorization: `Bearer ${token}` } : {}

      return axiosInstance
        .get<ApiResponse<unknown>>(url, { headers })
        .then((response) => {
          // console.log('GET Response:', response.data)
          return responseSchema.parse(response.data)
        })
        .catch((error: unknown) => {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.format())
          }
          throw error
        })
    }

    return useQuery({
      queryKey: getQueryKey(queryKey, params?.route, params?.query),
      queryFn,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...options,
    }) as UseQueryResult<z.infer<ResponseSchema>, Error>
  }
}
