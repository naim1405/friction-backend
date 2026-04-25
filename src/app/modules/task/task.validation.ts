import { z } from 'zod';

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
          locationId: z.string().optional(),
        })
      )
      .optional(),
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
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
};
