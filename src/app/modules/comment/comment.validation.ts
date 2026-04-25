import { z } from 'zod';

const createCommentSchema = z.object({
	body: z.object({
		taskId: z.string().min(1, 'Task id is required'),
		content: z.string().min(1, 'Comment content is required'),
	}),
});

export const CommentValidation = {
	createCommentSchema
};
