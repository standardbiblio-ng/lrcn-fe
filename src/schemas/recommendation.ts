import z from 'zod'

export const recommendationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  phoneNumber: z.string(),
})
