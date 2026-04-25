export type ICreateCommentPayload = {
	taskId: string;
	content: string;
};

export type ICommentFilters = {
	taskId?: string;
	tastId?: string;
};
