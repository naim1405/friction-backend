import httpStatus from '../../../const/httpStatus';
import ApiError from '../../../errors/ApiError';
import type { JWTPayload } from '../../../interface/common';
import { prisma } from '../../../lib/prisma';
import type { ICreateVotePayload, IDeleteVotePayload } from './vote.interface';

const createVote = async (user: JWTPayload, payload: ICreateVotePayload) => {
	
    const step = await prisma.step.findUnique({
		where: { id: payload.stepId },
		select: { id: true },
	});

	if (!step) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
	}

	const vote = await prisma.vote.upsert({
		where: {
			userId_stepId: {
				userId: user.userId,
				stepId: payload.stepId,
			},
		},
		update: {
			value: {
				increment: 1,
			},
		},
		create: {
			userId: user.userId,
			stepId: payload.stepId,
			value: 1,
		},
	});

	return vote;
};

const deleteVote = async (user: JWTPayload, payload: IDeleteVotePayload) => {
	
    const vote = await prisma.vote.findUnique({
		where: {
			userId_stepId: {
				userId: user.userId,
				stepId: payload.stepId,
			},
		},
		select: { id: true, value: true },
	});

	if (!vote) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Vote not found');
	}

	if (vote.value <= 0) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Vote value cannot be less than 0');
	}

	if (vote.value === 1) {
		const deletedVote = await prisma.vote.delete({
			where: { id: vote.id },
		});

		return deletedVote;
	}

	const updatedVote = await prisma.vote.update({
		where: { id: vote.id },
		data: {
			value: {
				decrement: 1,
			},
		},
	});

	return updatedVote;
};

export const VoteServices = {
	createVote,
	deleteVote,
};
