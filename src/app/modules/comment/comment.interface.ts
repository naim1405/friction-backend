export type ICreateCommentPayload = {
	stepId: string;
	content: string;
};

export type ICommentFilters = {
	stepId?: string;
};
