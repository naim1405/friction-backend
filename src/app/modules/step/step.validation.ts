import { z } from 'zod';

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
    locationId: z.string().optional(),
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
      locationId: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});
export const StepValidation = {
  createStepSchema,
  updateStepSchema,
};
