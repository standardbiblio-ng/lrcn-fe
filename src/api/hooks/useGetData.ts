import z from 'zod'
import { createGetQueryHook } from './useGet'

// Single unified GET hook for entire application data
// Uses staleTime: 5 minutes by default (set in useGet.ts)
// Data is automatically refetched when invalidated after mutations
export const useGetMyApplication = createGetQueryHook({
  endpoint: '/applications',
  responseSchema: z.any(),
  queryKey: ['my-application'],
  requiresAuth: true,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  },
})
