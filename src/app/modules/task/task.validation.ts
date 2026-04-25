import { z } from 'zod';

const createTaskSchema = z.object({
	body: z.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().optional(),
		category: z.string().optional(),
		isPublished: z.boolean().optional(),
	}),
});

const updateTaskSchema = z.object({
	body: z
		.object({
			title: z.string().min(1, 'Title must not be empty').optional(),
			description: z.string().optional(),
			category: z.string().optional(),
			isPublished: z.boolean().optional()
		})
		.refine((data) => Object.keys(data).length > 0, {
			message: 'At least one field is required',
		}),
});

export const TaskValidation = {
	createTaskSchema,
	updateTaskSchema,
};
