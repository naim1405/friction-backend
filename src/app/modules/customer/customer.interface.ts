export type ICustomerFilters = {
	searchTerm?: string;
	name?: string;
	email?: string;
	phone?: string;
};

export type IUpdateCustomerPayload = {
	name?: string;
	email?: string;
	phone?: string;
};