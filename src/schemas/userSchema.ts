import z from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
})

export const userRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const userResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
})

export const loginRequestSchema = userRequestSchema
export const loginResponseSchema = userResponseSchema
