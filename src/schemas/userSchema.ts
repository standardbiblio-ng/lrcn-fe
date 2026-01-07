import z from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  phoneNumber: z.string().optional(),
  registeredMember: z
    .object({
      otherNames: z.string(),
      lastName: z.string(),
    })
    .nullable()
    .optional(),
})

export const userRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(7, 'Password must be at least 7 characters long'),
})

export const userResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
})

export const loginRequestSchema = userRequestSchema
export const loginResponseSchema = userResponseSchema

export const registerUserRequestSchema = userRequestSchema
  .extend({
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, {
        message: 'Phone number must contain only digits (0-9)',
      })
      .length(11, 'Phone number must be exactly 11 digits')
      .refine(
        (phone) => {
          // Nigerian phone number validation
          const validPrefixes = [
            '070',
            '071',
            '080',
            '081',
            '090',
            '091', // MTN, Glo, Airtel, 9mobile
            '0802',
            '0803',
            '0804',
            '0805',
            '0806',
            '0807',
            '0808',
            '0809', // Airtel
            '0810',
            '0811',
            '0812',
            '0813',
            '0814',
            '0815',
            '0816',
            '0817',
            '0818', // MTN
            '0901',
            '0902',
            '0903',
            '0904',
            '0905',
            '0906',
            '0907',
            '0908',
            '0909', // 9mobile
            '0701',
            '0702',
            '0703',
            '0704',
            '0705',
            '0706',
            '0707',
            '0708', // MTN
          ]

          // Check if the number starts with any valid Nigerian prefix
          return validPrefixes.some((prefix) => phone.startsWith(prefix))
        },
        {
          message: 'Please enter a valid Nigerian mobile number',
        }
      ),
    regNo: z.string().optional(),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const registerUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  phoneNumber: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
})

// API schema (for data sent to backend)
export const registerUserApiSchema = userRequestSchema.extend({
  phoneNumber: z.string().regex(/^\+234\d{10}$/, {
    message: 'Phone number must be in format +2348012345678',
  }),
  regNo: z.string().optional(),
})
