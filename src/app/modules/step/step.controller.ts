import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import catchAsync from '../../../lib/catchAsync';
import sendResponse from '../../../lib/sendResponse';
import type {
	ICreateStepPayload,
	IUpdateStepPayload,
} from './step.interface';
import { StepServices } from './step.service';

const createStep = catchAsync(async (req: Request, res: Response) => {
	const result = await StepServices.createStep(req.body as ICreateStepPayload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Step created successfully!',
		data: result,
	});
});

const updateStepById = catchAsync(async (req: Request, res: Response) => {
	const result = await StepServices.updateStepById(
		req.params['id'] as string,
		req.body as IUpdateStepPayload
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Step updated successfully!',
		data: result,
	});
});
    
const getStepById = catchAsync(async (req: Request, res: Response) => {
	const result = await StepServices.getStepById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Step fetched successfully!',
		data: result,
	});
});

const deleteStepById = catchAsync(async (req: Request, res: Response) => {
	const result = await StepServices.deleteStepById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Step deleted successfully!',
		data: result,
	});
});

export const StepController = {
	createStep,
	updateStepById,
	deleteStepById,
	getStepById,
};
