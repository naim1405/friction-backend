import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import catchAsync from '../../../lib/catchAsync';
import sendResponse from '../../../lib/sendResponse';
import pick from '../../../lib/pick';
import { paginationFields } from '../../../const/pagination';
import { customerFilterableFields } from './customer.const';
import { customerServices } from './customer.service';
import { IUpdateCustomerPayload } from './customer.interface';


const getAllCustomer = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, customerFilterableFields);
	const paginationOptions = pick(req.query, paginationFields);

	const result = await customerServices.getAllCustomer(filters, paginationOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Customer fetched successfully!',
		meta: result.meta,
		data: result.data,
	});
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
	const result = await customerServices.getCustomerById(req.params["id"] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Customer fetched successfully!',
		data: result,
	});
});

const updateCustomerById = catchAsync(async (req: Request, res: Response) => {
	const result = await customerServices.updateCustomerById(
		req.params["id"] as string,
		req.body as IUpdateCustomerPayload
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Customer updated successfully!',
		data: result,
	});
});

const deleteCustomerById = catchAsync(async (req: Request, res: Response) => {
	const result = await customerServices.deleteCustomerById(req.params["id"] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Customer deleted successfully!',
		data: result,
	});
});

export const customerController = {
	getAllCustomer,
	getCustomerById,
	updateCustomerById,
	deleteCustomerById,
};
