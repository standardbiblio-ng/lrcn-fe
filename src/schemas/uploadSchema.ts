import z from 'zod'

export const uploadRequestSchema = z.array(
  z.object({
    name: z.string().min(2).max(100),
    fileUrl: z.string(),
    fileType: z.string(),
    uploadedAt: z.string(),
  })
)

export const uploadSchema = z.object({
  documents: uploadRequestSchema,
})

// export const uploadRequestSchema = z.array(
//   z.object({
//     name: z.string().min(2).max(100),
//     fileUrl: z
//       .string()
//       .refine(
//         (val) =>
//           val.startsWith('data:') || /^https?:\/\/.+/.test(val),
//         { message: 'Invalid file URL format' }
//       ),
//     fileType: z.string().regex(/^(image\/|application\/pdf)$/),
//     uploadedAt: z.string(),
//   })
// );

// export const uploadSchema = z.object({
//   documents: uploadRequestSchema,
// });
