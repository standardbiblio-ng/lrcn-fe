import z from 'zod'
import { attestationSchema } from '@/schemas/attestation'
import { createGetQueryHook } from './useGet'

export const useGetBioData = createGetQueryHook({
  endpoint: '/applications/my/bio-data',
  responseSchema: z.any(),
  queryKey: ['my-bio-data'],
  // requiresAuth: true,
})

export const useGetAcademicHistory = createGetQueryHook({
  endpoint: '/applications/my/academic-history',
  responseSchema: z.any(),
  queryKey: ['my-acad-history'],
  // requiresAuth: true,
})

export const useGetAttestation = createGetQueryHook({
  endpoint: '/applications/my/attestation',
  responseSchema: attestationSchema,
  queryKey: ['my-attestation'],
  // requiresAuth: true,
})

export const useGetEmploymentHistory = createGetQueryHook({
  endpoint: '/applications/my/employment-history',
  responseSchema: z.any(),
  queryKey: ['my-employment-history'],
  // requiresAuth: true,
})

export const useGetRecommendation = createGetQueryHook({
  endpoint: '/applications/my/recommendations',
  responseSchema: z.any(),
  queryKey: ['my-recommendations'],
  // requiresAuth: true,
})

export const useGetUploadDocuments = createGetQueryHook({
  endpoint: '/applications/my/documents',
  responseSchema: z.any(),
  queryKey: ['my-documents'],
  // requiresAuth: true,
})
