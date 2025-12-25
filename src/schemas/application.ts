import z from 'zod'

// Academic History Item
export const academicHistoryItemSchema = z
  .object({
    institution: z.string().min(1, 'Institution is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date.',
    path: ['endDate'],
  })

// Work Experience Item
export const workExperienceItemSchema = z.object({
  organisation: z.string().min(1, 'Organisation is required'),
  positionHeld: z.string().min(1, 'Position is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
})

// Employment History (New flat structure)
export const employmentHistoryItemSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  status: z.string().min(1, 'Status is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  organisation: z.string().min(1, 'Organisation is required'),
  positionHeld: z.string().min(1, 'Position is required'),
})

// Bio Data
export const bioDataSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(100),
  lastName: z.string().min(2, 'Last name is required').max(100),
  otherNames: z.string().optional(),
  previousNames: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender: z.enum(['Male', 'Female']),
})

// Recommendation
export const recommendationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
})

// Document
export const documentSchema = z.object({
  name: z.string().min(2, 'Document name is required').max(100),
  fileKey: z.string().min(1, 'File key is required'),
  fileType: z.string().min(1, 'File type is required'),
  uploadedAt: z.date().or(z.string()).optional(),
  fileUrl: z.string().optional(), // Computed by backend from fileKey
})

// Attestation
export const attestationSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the attestation',
  }),
})

// Complete Application Schema
export const applicationSchema = z.object({
  bioData: bioDataSchema,
  academicHistory: z
    .array(academicHistoryItemSchema)
    .min(1, 'At least one academic history entry is required'),
  employmentHistory: z
    .array(employmentHistoryItemSchema)
    .min(1, 'At least one employment history entry is required'),
  attestation: attestationSchema,
  recommendations: z.array(recommendationSchema).optional(),
  documents: z.array(documentSchema).optional(),
})

// Type exports
export type AcademicHistoryItem = z.infer<typeof academicHistoryItemSchema>
export type WorkExperienceItem = z.infer<typeof workExperienceItemSchema>
export type EmploymentHistoryItem = z.infer<typeof employmentHistoryItemSchema>
export type BioData = z.infer<typeof bioDataSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
export type Document = z.infer<typeof documentSchema>
export type Attestation = z.infer<typeof attestationSchema>
export type Application = z.infer<typeof applicationSchema>

// Partial schemas for individual form submissions (with phone number formatting)
export const bioDataSubmitSchema = bioDataSchema.extend({
  phoneNumber: z.string().regex(/^\+234\d{10}$/, {
    message: 'Phone number must be in format +2348012345678',
  }),
})

export const academicHistorySubmitSchema = z.object({
  items: z.array(academicHistoryItemSchema),
})

export const employmentHistorySubmitSchema = z.object({
  items: z.array(employmentHistoryItemSchema),
})

export const recommendationSubmitSchema = recommendationSchema

export const documentsSubmitSchema = z.object({
  items: z.array(documentSchema),
})
