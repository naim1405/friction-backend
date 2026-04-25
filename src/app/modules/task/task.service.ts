import type { Prisma } from '../../../generated/prisma/client';
import httpStatus from '../../../const/httpStatus';
import type { IPaginationOptions } from '../../../interface/common';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { prisma } from '../../../lib/prisma';
import { taskSearchableFields } from './task.const';
import type {
  ICreateTaskPayload,
  ITaskFilters,
  IUpdateTaskPayload,
} from './task.interface';
import { fallbackTasks } from '../shohoj/shohoj.data';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const getUniqueSlug = async (title: string, requestedSlug?: string) => {
  const baseSlug = slugify(requestedSlug || title) || `task-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.task.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const getFallbackTasks = (searchTerm?: string) => {
  const normalizedSearch = searchTerm?.trim().toLowerCase();

  return fallbackTasks
    .filter((task) => {
      if (!normalizedSearch) {
        return true;
      }

      return [
        task.title,
        task.description,
        task.summary,
        task.category,
        task.slug,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .map((task) => ({
      id: task.slug,
      ...task,
      steps: task.steps.map((step, index) => ({
        id: `${task.slug}-step-${index + 1}`,
        taskId: task.slug,
        ...step,
        locationId: step.locationSeedId,
      })),
    }));
};

const getAllTasks = async (
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, isPublished, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: Prisma.TaskWhereInput[] = [];

  if (isPublished !== undefined) {
    andConditions.push({
      isPublished: isPublished === true || isPublished === 'true',
    });
  } else {
    andConditions.push({ isPublished: true });
  }

  if (searchTerm) {
    andConditions.push({
      OR: taskSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as const },
      })),
    });
  }

  const exactFilters = Object.entries(filterData)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => ({
      [key]: { equals: value },
    }));

  if (exactFilters.length) {
    andConditions.push({ AND: exactFilters });
  }

  const whereConditions: Prisma.TaskWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.TaskOrderByWithRelationInput;

  try {
    let result = await prisma.task.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy,
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    let total = await prisma.task.count({ where: whereConditions });

    if (result.length === 0 && !Object.keys(filterData).length) {
      const fallbackResult = getFallbackTasks(searchTerm);

      result = fallbackResult as unknown as typeof result;
      total = fallbackResult.length;
    }

    return {
      meta: { page, limit, total },
      data: result,
    };
  } catch {
    const fallbackResult = getFallbackTasks(searchTerm);

    return {
      meta: { page, limit, total: fallbackResult.length },
      data: fallbackResult,
    };
  }
};

const getTaskById = async (id: string) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        isPublished: true,
        id: id,
      },
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
          include: {
            location: true,
            votes: true,
          },
        },
      },
    });

    if (!task) {
      const fallbackTask = fallbackTasks.find((item) => item.slug === id);

      if (fallbackTask) {
        return {
          id: fallbackTask.slug,
          ...fallbackTask,
          steps: fallbackTask.steps.map((step, index) => ({
            id: `${fallbackTask.slug}-step-${index + 1}`,
            taskId: fallbackTask.slug,
            ...step,
            locationId: step.locationSeedId,
          })),
        };
      }

      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }

    return task;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const fallbackTask = fallbackTasks.find((item) => item.slug === id);

    if (fallbackTask) {
      return {
        id: fallbackTask.slug,
        ...fallbackTask,
        steps: fallbackTask.steps.map((step, index) => ({
          id: `${fallbackTask.slug}-step-${index + 1}`,
          taskId: fallbackTask.slug,
          ...step,
          locationId: step.locationSeedId,
        })),
      };
    }

    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
};

const createTask = async (payload: ICreateTaskPayload) => {
  const slug = await getUniqueSlug(payload.title, payload.slug);
  const steps = (payload.steps ?? []).map((step, index) => ({
    title: step.title,
    order: step.order ?? index + 1,
    estimatedCost: step.estimatedCost ?? 0,
    documents: step.documents ?? [],
    tips: step.tips ?? [],
    contributionLocked: step.contributionLocked ?? false,
    ...(step.description !== undefined
      ? { description: step.description }
      : {}),
    ...(step.estimatedTime !== undefined
      ? { estimatedTime: step.estimatedTime }
      : {}),
    ...(step.locationId ? { locationId: step.locationId } : {}),
  }));

  const taskCreateData: Prisma.TaskCreateInput = {
    slug,
    title: payload.title,
    ...(payload.tagline !== undefined ? { tagline: payload.tagline } : {}),
    ...(payload.description !== undefined
      ? { description: payload.description }
      : {}),
    ...(payload.summary !== undefined ? { summary: payload.summary } : {}),
    ...(payload.category !== undefined ? { category: payload.category } : {}),
    ...(payload.estimatedDays !== undefined
      ? { estimatedDays: payload.estimatedDays }
      : {}),
    ...(payload.estimatedCostBdt !== undefined
      ? { estimatedCostBdt: payload.estimatedCostBdt }
      : {}),
    ...(payload.difficulty !== undefined
      ? { difficulty: payload.difficulty }
      : {}),
    ...(payload.documents !== undefined
      ? { documents: payload.documents }
      : {}),
    ...(payload.aiSummary !== undefined
      ? { aiSummary: payload.aiSummary }
      : {}),
    ...(payload.communityTip !== undefined
      ? { communityTip: payload.communityTip }
      : {}),
    ...(payload.coverLabel !== undefined
      ? { coverLabel: payload.coverLabel }
      : {}),
    ...(payload.isPublished !== undefined
      ? { isPublished: payload.isPublished }
      : {}),
    ...(steps.length > 0
      ? {
          steps: {
            create: steps,
          },
        }
      : {}),
  };

  const createdTask = await prisma.task.create({
    data: taskCreateData,
  });

  return prisma.task.findUnique({
    where: { id: createdTask.id },
    include: {
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      steps: {
        orderBy: {
          order: 'asc',
        },
        include: {
          location: true,
          votes: true,
        },
      },
    },
  });
};

const updateTaskById = async (id: string, payload: IUpdateTaskPayload) => {
  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const result = await prisma.task.update({
    where: { id },
    data: {
      ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.tagline !== undefined ? { tagline: payload.tagline } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
      ...(payload.summary !== undefined ? { summary: payload.summary } : {}),
      ...(payload.category !== undefined ? { category: payload.category } : {}),
      ...(payload.estimatedDays !== undefined
        ? { estimatedDays: payload.estimatedDays }
        : {}),
      ...(payload.estimatedCostBdt !== undefined
        ? { estimatedCostBdt: payload.estimatedCostBdt }
        : {}),
      ...(payload.difficulty !== undefined
        ? { difficulty: payload.difficulty }
        : {}),
      ...(payload.documents !== undefined
        ? { documents: payload.documents }
        : {}),
      ...(payload.aiSummary !== undefined
        ? { aiSummary: payload.aiSummary }
        : {}),
      ...(payload.communityTip !== undefined
        ? { communityTip: payload.communityTip }
        : {}),
      ...(payload.coverLabel !== undefined
        ? { coverLabel: payload.coverLabel }
        : {}),
      ...(payload.isPublished !== undefined
        ? { isPublished: payload.isPublished }
        : {}),
    },
  });

  return result;
};

const deleteTaskById = async (id: string) => {
  const existingTask = await prisma.task.findUnique({
    where: { id, isPublished: true },
    select: { id: true },
  });

  if (!existingTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const deletedTask = await prisma.task.update({
    where: { id },
    data: { isPublished: false },
  });

  return deletedTask;
};

export const TaskServices = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
};
