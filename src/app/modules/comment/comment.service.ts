import httpStatus from '../../../const/httpStatus';
import ApiError from '../../../errors/ApiError';
import type { JWTPayload } from '../../../interface/common';
import { prisma } from '../../../lib/prisma';
import type { ICommentFilters, ICreateCommentPayload } from './comment.interface';

const createComment = async (user: JWTPayload, payload: ICreateCommentPayload) => {
	
    const step = await prisma.step.findUnique({
		where: { id: payload.stepId },
		select: { id: true },
	});

	if (!step) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
	}

	const createdComment = await prisma.comment.create({
		data: {
			content: payload.content,
			stepId: payload.stepId,
			userId: user.userId,
		},
	});

	return createdComment;
};

const getComments = async (filters: ICommentFilters) => {
	
    if (!filters.stepId) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Step id is required');
	}

	const comments = await prisma.comment.findMany({
		where: {
			stepId: filters.stepId,
		},
		orderBy: {
			createdAt: 'desc',
		}
	});

	return comments;
};

const deleteCommentById = async (id: string) => {
	
    const comment = await prisma.comment.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!comment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
	}

	const deletedComment = await prisma.comment.delete({
		where: { id },
	});

	return deletedComment;
};

export const CommentServices = {
	createComment,
	getComments,
	deleteCommentById,
};
