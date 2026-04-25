import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import { paginationFields } from '../../../const/pagination';
import catchAsync from '../../../lib/catchAsync';
import pick from '../../../lib/pick';
import sendResponse from '../../../lib/sendResponse';
import { locationFilterableFields } from './location.const';
import type { ICreateLocationPayload } from './location.interface';
import { LocationServices } from './location.service';

const getAllLocations = catchAsync(async (req: Request, res: Response) => {
	
    const filters = pick(req.query, locationFilterableFields);
	const paginationOptions = pick(req.query, paginationFields);

	const result = await LocationServices.getAllLocations(filters, paginationOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Locations fetched successfully!',
		meta: result.meta,
		data: result.data,
	});
});

const getLocationById = catchAsync(async (req: Request, res: Response) => {
	const result = await LocationServices.getLocationById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Location fetched successfully!',
		data: result,
	});
});

const createLocation = catchAsync(async (req: Request, res: Response) => {
	const result = await LocationServices.createLocation(req.body as ICreateLocationPayload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Location created successfully!',
		data: result,
	});
});

export const LocationController = {
	getAllLocations,
	getLocationById,
	createLocation,
};
