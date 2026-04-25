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

const createStepSchema = z.object({
  body: z.object({
    taskId: z.string().min(1, 'Task id is required'),
    title: z.string().min(1, 'Step title is required'),
    description: z.string().optional(),
    order: z.number().int().min(0, 'Step order must be a non-negative integer'),
    estimatedTime: z.string().optional(),
    estimatedCost: z
      .number()
      .nonnegative('Estimated cost must be greater than or equal to 0')
      .optional(),
    documents: z.array(z.string()).optional(),
    tips: z.array(z.string()).optional(),
    contributionLocked: z.boolean().optional(),
    locationId: z.string().min(1).nullable().optional(),
    location: locationInputSchema.optional(),
  }).refine((data) => !(data.locationId && data.location), {
    message: 'Provide either locationId or location, not both',
    path: ['location'],
  }),
});

const updateStepSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, 'Step title must not be empty').optional(),
      description: z.string().optional(),
      order: z
        .number()
        .int()
        .min(0, 'Step order must be a non-negative integer')
        .optional(),
      estimatedTime: z.string().optional(),
      estimatedCost: z
        .number()
        .nonnegative('Estimated cost must be greater than or equal to 0')
        .optional(),
      documents: z.array(z.string()).optional(),
      tips: z.array(z.string()).optional(),
      contributionLocked: z.boolean().optional(),
      locationId: z.string().min(1).nullable().optional(),
      location: locationInputSchema.optional(),
    })
    .refine((data) => !(data.locationId && data.location), {
      message: 'Provide either locationId or location, not both',
      path: ['location'],
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});
export const StepValidation = {
  createStepSchema,
  updateStepSchema,
};
