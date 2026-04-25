import { z } from 'zod';

const createLocationSchema = z.object({
	body: z.object({
		name: z.string().min(1, 'Name is required'),
		address: z.string().optional(),
		city: z.string().optional(),
		country: z.string().optional(),
		latitude: z.number(),
		longitude: z.number(),
		type: z.string().optional(),
	}),
});

export const LocationValidation = {
	createLocationSchema,
};
