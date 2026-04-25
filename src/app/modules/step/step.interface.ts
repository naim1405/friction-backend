export type ICreateStepPayload = {
	taskId: string;
	title: string;
	description?: string;
	order: number;
	estimatedTime?: string;
	estimatedCost?: number;
	locationId?: string;
};

export type IUpdateStepPayload = {
	title?: string;
	description?: string;
	order?: number;
	estimatedTime?: string;
	estimatedCost?: number;
	locationId?: string;
};
