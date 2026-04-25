import type { Prisma } from '../../../generated/prisma/client';
import httpStatus from '../../../const/httpStatus';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../lib/prisma';
import type {
	ICreateStepPayload,
	IUpdateStepPayload,
} from './step.interface';

const getStepById = async (id: string) => {
	
    const step = await prisma.step.findUnique({
		where: { id },
		include: {
			task: true,
			location: true,
			comments: true,
			votes: true,
		},
	});

	if (!step) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
	}

	return step;
};

const createStep = async (payload: ICreateStepPayload) => {
	
    const task = await prisma.task.findUnique({
		where: { id: payload.taskId },
		select: { id: true },
	});

	if (!task) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
	}

	if (payload.locationId) {
		
        const location = await prisma.location.findUnique({
			where: { id: payload.locationId },
			select: { id: true },
		});

		if (!location) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
		}
	}

	const stepCreateData: Prisma.StepUncheckedCreateInput = {
			title: payload.title,
			order: payload.order,
			taskId: payload.taskId,
			...(payload.description !== undefined ? { description: payload.description } : {}),
			...(payload.estimatedTime !== undefined ? { estimatedTime: payload.estimatedTime } : {}),
			...(payload.estimatedCost !== undefined ? { estimatedCost: payload.estimatedCost } : {}),
			...(payload.locationId !== undefined ? { locationId: payload.locationId } : {}),
		};

	return prisma.step.create({
			data: stepCreateData,
	});
};

const updateStepById = async (id: string, payload: IUpdateStepPayload) => {
	
    const step = await prisma.step.findUnique({
		where: { id },
		select: { id: true, order: true, taskId: true },
	});

	if (!step) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
	}

	if (payload.locationId) {
        const location = await prisma.location.findUnique({
			where: { id: payload.locationId },
			select: { id: true },
		});

		if (!location) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
		}
	}

	const stepUpdateData: Prisma.StepUncheckedUpdateInput = {
			...(payload.title !== undefined ? { title: payload.title } : {}),
			...(payload.description !== undefined ? { description: payload.description } : {}),
			...(payload.order !== undefined ? { order: payload.order } : {}),
			...(payload.estimatedTime !== undefined ? { estimatedTime: payload.estimatedTime } : {}),
			...(payload.estimatedCost !== undefined ? { estimatedCost: payload.estimatedCost } : {}),
			...(payload.locationId !== undefined ? { locationId: payload.locationId } : {}),
	};

	return prisma.step.update({
		where: { id },
		data: stepUpdateData,
	});
};


const deleteStepById = async (id: string) => {
	
    const step = await prisma.step.findUnique({
		where: { id },
		select: { id: true, order: true, taskId: true },
	});

	if (!step) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
	}

	const deletedStep = await prisma.$transaction(async (transactionClient) => {
		
        await transactionClient.comment.deleteMany({
			where: { stepId: id },
		});

		await transactionClient.vote.deleteMany({
			where: { stepId: id },
		});

		await transactionClient.step.delete({
			where: { id },
		});

		await transactionClient.step.updateMany({
			where: {
				taskId: step.taskId,
				order: {
					gt: step.order,
				},
			},
			data: {
				order: {
					decrement: 1,
				},
			},
		});

		return { id };
	});

	return deletedStep;
};

export const StepServices = {
	getStepById,
	createStep,
	updateStepById,
	deleteStepById,
};
