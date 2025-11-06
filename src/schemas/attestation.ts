import z from 'zod'

export const attestationSchema = z.object({
  agreed: z.boolean(),
})
