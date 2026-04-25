export type ITaskFilters = {
	searchTerm?: string;
	title?: string;
	category?: string;
	isPublished?: string | boolean;
};

export type ITaskStepPayload = {
	title: string;
	description?: string;
	order: number;
	estimatedTime?: string;
	estimatedCost?: number;
	locationId?: string;
};

export type ICreateTaskPayload = {
	title: string;
	description?: string;
	category?: string;
	isPublished?: boolean;
};

export type IUpdateTaskPayload = {
	title?: string;
	description?: string;
	category?: string;
	isPublished?: boolean;
};
