import type { Prisma } from '../../../generated/prisma/client';
import httpStatus from '../../../const/httpStatus';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../lib/prisma';
import type { ICreateStepPayload, IUpdateStepPayload } from './step.interface';
import { LocationServices } from '../location/location.service';

const assertLocationExists = async (locationId: string) => {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
    select: { id: true },
  });

  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }

  return location.id;
};

const getStepById = async (id: string) => {
  const step = await prisma.step.findUnique({
    where: { id },
    include: {
      task: {
        include: {
          mainLocation: true,
        },
      },
      location: true,
      votes: true,
    },
  });

  if (!step) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
  }

  return {
    ...step,
    effectiveLocation: step.location ?? step.task.mainLocation,
  };
};

const createStep = async (payload: ICreateStepPayload) => {
  const task = await prisma.task.findUnique({
    where: { id: payload.taskId },
    select: { id: true, mainLocationId: true },
  });

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (payload.locationId && payload.location) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Provide either locationId or location, not both'
    );
  }

  let resolvedLocationId = task.mainLocationId;

  if (payload.locationId) {
    resolvedLocationId = await assertLocationExists(payload.locationId);
  }

  if (payload.location) {
    const location = await LocationServices.findOrCreateLocation(payload.location);
    resolvedLocationId = location.id;
  }

  if (!resolvedLocationId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Task has no main location. Provide step locationId or location'
    );
  }

  const stepCreateData: Prisma.StepUncheckedCreateInput = {
    title: payload.title,
    order: payload.order,
    taskId: payload.taskId,
    ...(payload.description !== undefined
      ? { description: payload.description }
      : {}),
    ...(payload.estimatedTime !== undefined
      ? { estimatedTime: payload.estimatedTime }
      : {}),
    ...(payload.estimatedCost !== undefined
      ? { estimatedCost: payload.estimatedCost }
      : {}),
    ...(payload.documents !== undefined
      ? { documents: payload.documents }
      : {}),
    ...(payload.tips !== undefined ? { tips: payload.tips } : {}),
    ...(payload.contributionLocked !== undefined
      ? { contributionLocked: payload.contributionLocked }
      : {}),
    locationId: resolvedLocationId,
  };

  const createdStep = await prisma.step.create({
    data: stepCreateData,
  });

  return prisma.step.findUnique({
    where: { id: createdStep.id },
    include: {
      task: {
        include: {
          mainLocation: true,
        },
      },
      location: true,
      votes: true,
    },
  });
};

const updateStepById = async (id: string, payload: IUpdateStepPayload) => {
  const step = await prisma.step.findUnique({
    where: { id },
    select: {
      id: true,
      order: true,
      taskId: true,
      task: {
        select: {
          mainLocationId: true,
        },
      },
    },
  });

  if (!step) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Step not found');
  }

  if (payload.locationId && payload.location) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Provide either locationId or location, not both'
    );
  }

  let resolvedLocationId: string | undefined;

  if (payload.locationId !== undefined) {
    if (payload.locationId === null) {
      if (!step.task.mainLocationId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Task has no main location to inherit'
        );
      }

      resolvedLocationId = step.task.mainLocationId;
    } else {
      resolvedLocationId = await assertLocationExists(payload.locationId);
    }
  }

  if (payload.location) {
    const location = await LocationServices.findOrCreateLocation(payload.location);
    resolvedLocationId = location.id;
  }

  const stepUpdateData: Prisma.StepUncheckedUpdateInput = {
    ...(payload.title !== undefined ? { title: payload.title } : {}),
    ...(payload.description !== undefined
      ? { description: payload.description }
      : {}),
    ...(payload.order !== undefined ? { order: payload.order } : {}),
    ...(payload.estimatedTime !== undefined
      ? { estimatedTime: payload.estimatedTime }
      : {}),
    ...(payload.estimatedCost !== undefined
      ? { estimatedCost: payload.estimatedCost }
      : {}),
    ...(payload.documents !== undefined
      ? { documents: payload.documents }
      : {}),
    ...(payload.tips !== undefined ? { tips: payload.tips } : {}),
    ...(payload.contributionLocked !== undefined
      ? { contributionLocked: payload.contributionLocked }
      : {}),
    ...(resolvedLocationId !== undefined
      ? { locationId: resolvedLocationId }
      : {}),
  };

  const updatedStep = await prisma.step.update({
    where: { id },
    data: stepUpdateData,
  });

  return prisma.step.findUnique({
    where: { id: updatedStep.id },
    include: {
      task: {
        include: {
          mainLocation: true,
        },
      },
      location: true,
      votes: true,
    },
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
