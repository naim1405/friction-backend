import httpStatus from '../../../const/httpStatus';
import type { IPaginationOptions } from '../../../interface/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { Prisma } from '../../../generated/prisma/client';
import { UserStatus } from '../../../generated/prisma/enums';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../lib/prisma';
import { adminSearchableFields } from './admin.const';
import type { IAdminFilters, IUpdateAdminPayload } from './admin.interface';

const getAllAdmins = async (
	filters: IAdminFilters,
	paginationOptions: IPaginationOptions
) => {
	const { searchTerm, ...filterData } = filters;
	const { page, limit, skip, sortBy, sortOrder } =paginationHelpers.calculatePagination(paginationOptions);

	const andConditions: Prisma.AdminWhereInput[] = [{ isDeleted: false }];

	if (searchTerm) {
		andConditions.push({
			OR: adminSearchableFields.map((field) => ({
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

	const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
	const orderBy = {
		[sortBy]: sortOrder,
	} as Prisma.AdminOrderByWithRelationInput;

	const result = await prisma.admin.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy,
	});

	const total = await prisma.admin.count({ where: whereConditions });

	return {
		meta: { page, limit, total },
		data: result,
	};
};

const getAdminById = async (id: string) => {
	const admin = await prisma.admin.findFirst({
		where: { id, isDeleted: false },
	});

	if (!admin) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
	}

	return admin;
};

const updateAdminById = async (id: string, payload: IUpdateAdminPayload) => {
	
    const hasAnyField = Object.values(payload).some(
		(value) => value !== undefined
	);

	if (!hasAnyField) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'At least one field is required to update admin'
		);
	}

	const existingAdmin = await prisma.admin.findFirst({
		where: { id, isDeleted: false },
		select: {
			id: true,
			userId: true,
		},
	});

	if (!existingAdmin) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
	}

	const adminData: Prisma.AdminUpdateInput = {};
	const userData: Prisma.UserUpdateInput = {};

	if (payload.name !== undefined) {
		adminData.name = payload.name;
	}

	if (payload.email !== undefined) {
		adminData.email = payload.email;
		userData.email = payload.email;
	}

	if (payload.phone !== undefined) {
		adminData.phone = payload.phone;
		userData.phone = payload.phone;
	}

	const updatedAdmin = await prisma.$transaction(async (transactionClient) => {
		if (Object.keys(userData).length) {
			await transactionClient.user.update({
				where: {
					id: existingAdmin.userId,
				},
				data: userData,
			});
		}

		return transactionClient.admin.update({
			where: {
				id,
			},
			data: adminData,
		});
	});

	return updatedAdmin;
};

const deleteAdminById = async (id: string) => {
	const existingAdmin = await prisma.admin.findFirst({
		where: { id, isDeleted: false },
		select: {
			id: true,
			userId: true,
		},
	});

	if (!existingAdmin) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
	}

	const deletedAdmin = await prisma.$transaction(async (transactionClient) => {
		await transactionClient.user.update({
			where: {
				id: existingAdmin.userId,
			},
			data: {
				status: UserStatus.DELETED,
			},
		});

		return transactionClient.admin.update({
			where: {
				id,
			},
			data: {
				isDeleted: true,
			},
		});
	});

	return deletedAdmin;
};

export const AdminServices = {
	getAllAdmins,
	getAdminById,
	updateAdminById,
	deleteAdminById,
};
