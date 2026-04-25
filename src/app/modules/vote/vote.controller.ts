import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';
import catchAsync from '../../../lib/catchAsync';
import sendResponse from '../../../lib/sendResponse';
import type { ICreateVotePayload, IDeleteVotePayload } from './vote.interface';
import { VoteServices } from './vote.service';

const createVote = catchAsync(async (req: Request, res: Response) => {
	
    const payload = (req.body as ICreateVotePayload);
    const result = await VoteServices.createVote(req.user!,payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Vote created successfully!',
		data: result,
	});
});

const deleteVote = catchAsync(async (req: Request, res: Response) => {
	
    const payload = (req.body as IDeleteVotePayload);
	const result = await VoteServices.deleteVote(req.user!,payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Vote deleted successfully!',
		data: result,
	});
});

export const VoteController = {
	createVote,
	deleteVote,
};
