import { z } from 'zod';

const updateCustomerSchema = z.object({
	body: z
		.object({
			name: z.string().min(1, 'Name must not be empty').optional(),
			email: z.string().email('Please provide a valid email address').optional(),
			phone: z.string().min(11, 'Phone number must be at least 11 digits').optional(),
		})
		.refine((data) => Object.keys(data).length > 0, {
			message: 'At least one field is required',
		}),
});

export const customerValidation = {
	updateCustomerSchema,
};
