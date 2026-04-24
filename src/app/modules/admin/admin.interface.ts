export type IAdminFilters = {
	searchTerm?: string;
	name?: string;
	email?: string;
	phone?: string;
};

export type IUpdateAdminPayload = {
	name?: string;
	email?: string;
	phone?: string;
};
