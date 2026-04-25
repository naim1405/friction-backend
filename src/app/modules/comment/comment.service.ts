import httpStatus from '../../../const/httpStatus';
import ApiError from '../../../errors/ApiError';
import type { JWTPayload } from '../../../interface/common';
import { prisma } from '../../../lib/prisma';
import type { ICommentFilters, ICreateCommentPayload } from './comment.interface';

const createComment = async (user: JWTPayload, payload: ICreateCommentPayload) => {
	
    const task = await prisma.task.findUnique({
		where: { id: payload.taskId },
		select: { id: true },
	});

	if (!task) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
	}

	const createdComment = await prisma.comment.create({
		data: {
			content: payload.content,
			taskId: payload.taskId,
			userId: user.userId,
		},
	});

	return createdComment;
};

const getComments = async (filters: ICommentFilters) => {
	const taskId = filters.taskId ?? filters.tastId;

    if (!taskId) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Task id is required');
	}

	const comments = await prisma.comment.findMany({
		where: {
			taskId,
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
