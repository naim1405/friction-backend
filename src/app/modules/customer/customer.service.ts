import httpStatus from '../../../const/httpStatus';
import type { IPaginationOptions } from '../../../interface/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { Prisma } from '../../../generated/prisma/client';
import { UserStatus } from '../../../generated/prisma/enums';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../lib/prisma';
import { ICustomerFilters, IUpdateCustomerPayload } from './customer.interface';
import { customerSearchableFields } from './customer.const';


const getAllCustomer = async (
	filters: ICustomerFilters,
	paginationOptions: IPaginationOptions
) => {
	const { searchTerm, ...filterData } = filters;
	const { page, limit, skip, sortBy, sortOrder } =paginationHelpers.calculatePagination(paginationOptions);

	const andConditions: Prisma.CustomerWhereInput[] = [{ isDeleted: false }];

	if (searchTerm) {
		andConditions.push({
			OR: customerSearchableFields.map((field) => ({
				[field]: { contains: searchTerm, mode: 'insensitive' as const },
			})),
		});
	}

	const exactFilters = Object.entries(filterData).filter(([, value]) => value !== undefined && value !== '')
		.map(([key, value]) => ({
			[key]: { equals: value },
		}));

	if (exactFilters.length) {
		andConditions.push({ AND: exactFilters });
	}

	const whereConditions: Prisma.CustomerWhereInput = { AND: andConditions };
	const orderBy = {
		[sortBy]: sortOrder,
	} as Prisma.CustomerOrderByWithRelationInput;

	const result = await prisma.customer.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy,
	});

	const total = await prisma.customer.count({ where: whereConditions });

	return {
		meta: { page, limit, total },
		data: result,
	};
};

const getCustomerById = async (id: string) => {

	const customer = await prisma.customer.findFirst({
		where: { id, isDeleted: false },
	});

	if (!customer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
	}

	return customer;
};

const updateCustomerById = async (id: string, payload: IUpdateCustomerPayload) => {
	
    const hasAnyField = Object.values(payload).some(
		(value) => value !== undefined
	);

	if (!hasAnyField) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'At least one field is required to update customer'
		);
	}

	const existingCustomer = await prisma.customer.findFirst({
		where: { id, isDeleted: false },
		select: {
			id: true,
			userId: true,
		},
	});

	if (!existingCustomer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
	}

	const customerData: Prisma.CustomerUpdateInput = {};
	const userData: Prisma.UserUpdateInput = {};

	if (payload.name !== undefined) {
		customerData.name = payload.name;
	}

	if (payload.email !== undefined) {
		customerData.email = payload.email;
		userData.email = payload.email;
	}

	if (payload.phone !== undefined) {
		customerData.phone = payload.phone;
		userData.phone = payload.phone;
	}

	const updatedCustomer = await prisma.$transaction(async (transactionClient) => {
		if (Object.keys(userData).length) {
			await transactionClient.user.update({
				where: {
					id: existingCustomer.userId,
				},
				data: userData,
			});
		}

		return transactionClient.customer.update({
			where: {
				id,
			},
			data: customerData,
		});
	});

	return updatedCustomer;
};

const deleteCustomerById = async (id: string) => {
	const existingCustomer = await prisma.customer.findFirst({
		where: { id, isDeleted: false },
		select: {
			id: true,
			userId: true,
		},
	});

	if (!existingCustomer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
	}

	const deletedCustomer = await prisma.$transaction(async (transactionClient) => {
		await transactionClient.user.update({
			where: {
				id: existingCustomer.userId,
			},
			data: {
				status: UserStatus.DELETED,
			},
		});

		return transactionClient.customer.update({
			where: {
				id,
			},
			data: {
				isDeleted: true,
			},
		});
	});

	return deletedCustomer;
};

export const customerServices = {
	getAllCustomer,
	getCustomerById,
	updateCustomerById,
	deleteCustomerById,
};
