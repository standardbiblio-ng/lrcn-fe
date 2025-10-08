import { isAxiosError } from 'axios'
import { z, ZodError } from 'zod'

/**
 * Create a URL with query parameters and route parameters
 *
 * @param base - The base URL with route parameters
 * @param queryParams - The query parameters
 * @param routeParams - The route parameters
 * @returns The URL with query parameters
 * @example
 * createUrl('/api/users/:id', { page: 1 }, { id: 1 });
 * // => '/api/users/1?page=1'
 */
export function createUrl(
  base: string,
  queryParams?: Record<string, string | number | undefined>,
  routeParams?: Record<string, string | number | undefined>,
) {
  const url = Object.entries(routeParams ?? {}).reduce(
    (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
    base,
  )

  if (!queryParams) return url

  const query = new URLSearchParams()
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.append(key, String(value))
  })

  return `${url}?${query.toString()}`
}

/**
 * Generate a query key for React Query
 *
 * @param queryKey - The base query key
 * @param route - Route parameters
 * @param query - Query parameters
 * @returns The complete query key
 */
export function getQueryKey(
  queryKey: [string] | [string, Record<string, string | number | undefined>],
  route: Record<string, string | number | undefined> = {},
  query: Record<string, string | number | undefined> = {},
) {
  const [mainKey, otherKeys = {}] = queryKey
  return [mainKey, { ...otherKeys, ...route, ...query }]
}

/**
 * Handle request errors with proper error handling for Axios and Zod errors
 *
 * @param error - The error to handle
 * @throws The processed error
 */

export function handleRequestError(error: unknown) {
  if (isAxiosError(error)) {
    throw error.response?.data
  }

  if (error instanceof ZodError) {
    console.error(error.format())
  }

  console.log(error)
  throw error
}

/**
 * Pagination parameters type
 */
export type PaginationParams = {
  page?: number
  limit?: number
}

/**
 * Sortable query parameters type
 */
export type SortableQueryParams = {
  sort?: `${string}:${'asc' | 'desc'}`
}

/**
 * Pagination meta schema for API responses
 */
export const PaginationMetaSchema = z.object({
  total: z.number().int().min(0),
  perPage: z.number().int().positive(),
  currentPage: z.number().int().positive().nullable(),
  lastPage: z.number().int().positive(),
  firstPage: z.number().int().positive(),
  firstPageUrl: z.string(),
  lastPageUrl: z.string(),
  nextPageUrl: z.string().nullable(),
  previousPageUrl: z.string().nullable(),
})

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
