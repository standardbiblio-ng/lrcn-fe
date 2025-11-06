import z from 'zod'

export const employmentHistorySchema = z.object({
  employer: z.string(),
  address: z.string(),
  status: z.string(),
  startDate: z.string(),
  workExperience: z.array(
    z.object({
      organisation: z.string(),
      positionHeld: z.string(),
      startDate: z.string(),
    })
  ),
})

export const employmentHistoryRequestSchema = employmentHistorySchema
