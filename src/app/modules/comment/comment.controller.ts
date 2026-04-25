import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import catchAsync from '../../../lib/catchAsync';
import pick from '../../../lib/pick';
import sendResponse from '../../../lib/sendResponse';
import { commentFilterableFields } from './comment.const';
import type { ICreateCommentPayload } from './comment.interface';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req: Request, res: Response) => {
	
    const result = await CommentServices.createComment(
		req.user!,
		req.body as ICreateCommentPayload
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Comment created successfully!',
		data: result,
	});
});

const getComments = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, commentFilterableFields);
	const result = await CommentServices.getComments(filters);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Comments fetched successfully!',
		data: result,
	});
});

const deleteCommentById = catchAsync(async (req: Request, res: Response) => {
	
    const result = await CommentServices.deleteCommentById(req.params['id'] as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Comment deleted successfully!',
		data: result,
	});
});

export const CommentController = {
	createComment,
	getComments,
	deleteCommentById,
};
