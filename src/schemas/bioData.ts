import z from 'zod'

export const bioDataSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  otherNames: z.string().optional(),
  previousNames: z.string().optional(),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  phoneNumber: z.string(),
  nationality: z.string(),
  state: z.string(),
  lga: z.string(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender: z.enum(['Male', 'Female', '']),
})

// API schema (for data sent to backend)
export const submitBioDataApiSchema = bioDataSchema.extend({
  phoneNumber: z.string().regex(/^\+234\d{10}$/, {
    message: 'Phone number must be in format +2348012345678',
  }),
})
