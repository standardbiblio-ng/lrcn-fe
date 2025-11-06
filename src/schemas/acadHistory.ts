import z from 'zod'

export const acadHistorySchema = z.array(
  z
    .object({
      institution: z.string(),
      qualification: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: 'End date must be after start date.',
      path: ['endDate'], // The error will show under endDate
    })
)

export const acadHistoryRequestSchema = z.object({
  items: acadHistorySchema,
})
