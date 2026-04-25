import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import { paginationFields } from '../../../const/pagination';
import catchAsync from '../../../lib/catchAsync';
import pick from '../../../lib/pick';
import sendResponse from '../../../lib/sendResponse';
import { taskFilterableFields } from './task.const';
import type { ICreateTaskPayload, IUpdateTaskPayload } from './task.interface';
import { TaskServices } from './task.service';

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, taskFilterableFields);
	const paginationOptions = pick(req.query, paginationFields);

	const result = await TaskServices.getAllTasks(filters, paginationOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Tasks fetched successfully!',
		meta: result.meta,
		data: result.data,
	});
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskServices.getTaskById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Task fetched successfully!',
		data: result,
	});
});

const createTask = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskServices.createTask(req.body as ICreateTaskPayload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Task created successfully!',
		data: result,
	});
});

const updateTaskById = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskServices.updateTaskById(
		req.params['id'] as string,
		req.body as IUpdateTaskPayload
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Task updated successfully!',
		data: result,
	});
});

const deleteTaskById = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskServices.deleteTaskById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Task deleted successfully!',
		data: result,
	});
});

export const TaskController = {
	getAllTasks,
	getTaskById,
	createTask,
	updateTaskById,
	deleteTaskById,
};
