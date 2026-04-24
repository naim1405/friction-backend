import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';

import { AdminServices } from './admin.service';
import catchAsync from '../../../lib/catchAsync';
import sendResponse from '../../../lib/sendResponse';
import pick from '../../../lib/pick';
import { adminFilterableFields } from './admin.const';
import { paginationFields } from '../../../const/pagination';
import type { IUpdateAdminPayload } from './admin.interface';

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, adminFilterableFields);
	const paginationOptions = pick(req.query, paginationFields);

	const result = await AdminServices.getAllAdmins(filters, paginationOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admins fetched successfully!',
		meta: result.meta,
		data: result.data,
	});
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
	const result = await AdminServices.getAdminById(req.params["id"] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin fetched successfully!',
		data: result,
	});
});

const updateAdminById = catchAsync(async (req: Request, res: Response) => {
	const result = await AdminServices.updateAdminById(
		req.params["id"] as string,
		req.body as IUpdateAdminPayload
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin updated successfully!',
		data: result,
	});
});

const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
	const result = await AdminServices.deleteAdminById(req.params["id"] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin deleted successfully!',
		data: result,
	});
});

export const AdminController = {
	getAllAdmins,
	getAdminById,
	updateAdminById,
	deleteAdminById,
};
