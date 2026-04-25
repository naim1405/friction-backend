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
import { LocationServices } from '../location/location.service';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const isLegacyLocationRequiredFieldError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const knownError = error as {
    code?: string;
    meta?: { field?: string };
  };

  if (knownError.code !== 'P2032') {
    return false;
  }

  return ['source', 'sourcePlaceId', 'normalizedName', 'geoBucket'].includes(
    knownError.meta?.field ?? ''
  );
};

const patchLegacyLocationField = async (field: string, value: string) => {
  await prisma.$runCommandRaw({
    update: 'Location',
    updates: [
      {
        q: { [field]: null },
        u: { $set: { [field]: value } },
        multi: true,
      },
      {
        q: { [field]: { $exists: false } },
        u: { $set: { [field]: value } },
        multi: true,
      },
    ],
  });
};

const repairLegacyLocationDocuments = async () => {
  await patchLegacyLocationField('source', 'legacy');
  await patchLegacyLocationField('sourcePlaceId', 'legacy:unknown');
  await patchLegacyLocationField('normalizedName', 'unknown');
  await patchLegacyLocationField('geoBucket', '0.0000,0.0000');
};

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

const resolveTaskMainLocationId = async (
  payload: ICreateTaskPayload | IUpdateTaskPayload
) => {
  if (payload.mainLocationId && payload.mainLocation) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Provide either mainLocationId or mainLocation, not both'
    );
  }

  if (payload.mainLocationId) {
    return assertLocationExists(payload.mainLocationId);
  }

  if (payload.mainLocation) {
    const location = await LocationServices.findOrCreateLocation(
      payload.mainLocation
    );
    return location.id;
  }

  return null;
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

  const fetchTasks = () =>
    prisma.task.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy,
      include: {
        mainLocation: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
          include: {
            location: true,
          },
        },
      },
    });

  try {
    let result = await fetchTasks();

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
  } catch (error) {
    if (isLegacyLocationRequiredFieldError(error)) {
      try {
        await repairLegacyLocationDocuments();

        const result = await fetchTasks();
        const total = await prisma.task.count({ where: whereConditions });

        return {
          meta: { page, limit, total },
          data: result,
        };
      } catch {
        // If repair or retry fails, fallback is returned below.
      }
    }

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
        mainLocation: true,
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
  const mainLocationId = await resolveTaskMainLocationId(payload);

  if (!mainLocationId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Task main location is required. Provide mainLocationId or mainLocation'
    );
  }

  const slug = await getUniqueSlug(payload.title, payload.slug);
  const steps = await Promise.all(
    (payload.steps ?? []).map(async (step, index) => {
      if (step.locationId && step.location) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Provide either locationId or location for step override, not both'
        );
      }

      let stepLocationId = mainLocationId;

      if (step.locationId) {
        stepLocationId = await assertLocationExists(step.locationId);
      }

      if (step.location) {
        const createdLocation = await LocationServices.findOrCreateLocation(
          step.location
        );
        stepLocationId = createdLocation.id;
      }

      return {
        title: step.title,
        order: step.order ?? index + 1,
        estimatedCost: step.estimatedCost ?? 0,
        documents: step.documents ?? [],
        tips: step.tips ?? [],
        contributionLocked: step.contributionLocked ?? false,
        locationId: stepLocationId,
        ...(step.description !== undefined
          ? { description: step.description }
          : {}),
        ...(step.estimatedTime !== undefined
          ? { estimatedTime: step.estimatedTime }
          : {}),
      };
    })
  );

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
    mainLocation: {
      connect: { id: mainLocationId },
    },
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
      mainLocation: true,
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

  const mainLocationId = await resolveTaskMainLocationId(payload);

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
      ...(mainLocationId
        ? {
            mainLocation: {
              connect: { id: mainLocationId },
            },
          }
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
