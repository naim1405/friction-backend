import { z } from 'zod';

const createCommentSchema = z.object({
	body: z.object({
		stepId: z.string().min(1, 'Step id is required'),
		content: z.string().min(1, 'Comment content is required'),
	}),
});

export const CommentValidation = {
	createCommentSchema
};
