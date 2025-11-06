import z from 'zod'
import { createGetQueryHook } from './useGet'

export const useGetBioData = createGetQueryHook({
  endpoint: '/applications/my/bio-data',
  responseSchema: z.any(),
  queryKey: ['my-bio-data'],
})
