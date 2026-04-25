import { z } from 'zod';

const locationInputSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  source: z.string().optional(),
  sourcePlaceId: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.string().optional(),
  officeHours: z.string().optional(),
});

const createTaskSchema = z.object({
  body: z.object({
    slug: z.string().min(1, 'Slug is required').optional(),
    title: z.string().min(1, 'Title is required'),
    tagline: z.string().optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    category: z.string().optional(),
    estimatedDays: z.string().optional(),
    estimatedCostBdt: z.number().optional(),
    difficulty: z.string().optional(),
    documents: z.array(z.string()).optional(),
    aiSummary: z.string().optional(),
    communityTip: z.string().optional(),
    coverLabel: z.string().optional(),
    isPublished: z.boolean().optional(),
    mainLocationId: z.string().min(1, 'Main location id must not be empty').optional(),
    mainLocation: locationInputSchema.optional(),
    steps: z
      .array(
        z.object({
          title: z.string().min(1, 'Step title is required'),
          description: z.string().optional(),
          order: z.number().int().min(1).optional(),
          estimatedTime: z.string().optional(),
          estimatedCost: z.number().nonnegative().optional(),
          documents: z.array(z.string()).optional(),
          tips: z.array(z.string()).optional(),
          contributionLocked: z.boolean().optional(),
          locationId: z.string().min(1).nullable().optional(),
          location: locationInputSchema.optional(),
        })
        .refine((step) => !(step.locationId && step.location), {
          message: 'Provide either locationId or location for step override, not both',
          path: ['location'],
        })
      )
      .optional(),
  }).refine((data) => !!(data.mainLocationId || data.mainLocation), {
    message: 'Provide either mainLocationId or mainLocation',
    path: ['mainLocation'],
  }),
});

const updateTaskSchema = z.object({
  body: z
    .object({
      slug: z.string().min(1, 'Slug must not be empty').optional(),
      title: z.string().min(1, 'Title must not be empty').optional(),
      tagline: z.string().optional(),
      description: z.string().optional(),
      summary: z.string().optional(),
      category: z.string().optional(),
      estimatedDays: z.string().optional(),
      estimatedCostBdt: z.number().optional(),
      difficulty: z.string().optional(),
      documents: z.array(z.string()).optional(),
      aiSummary: z.string().optional(),
      communityTip: z.string().optional(),
      coverLabel: z.string().optional(),
      isPublished: z.boolean().optional(),
      mainLocationId: z
        .string()
        .min(1, 'Main location id must not be empty')
        .optional(),
      mainLocation: locationInputSchema.optional(),
    })
    .refine((data) => !(data.mainLocationId && data.mainLocation), {
      message: 'Provide either mainLocationId or mainLocation, not both',
      path: ['mainLocation'],
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
};
