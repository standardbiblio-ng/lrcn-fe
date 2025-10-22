import z from 'zod'

const acadHistorySchema = z.object({
  institution: z.string(),
  qualification: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})
