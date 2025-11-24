import z from 'zod'

export const paymentSchema = z.object({
  status: z.string(),

  isPaymentVerified: z.boolean(),
})
