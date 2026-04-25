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


const getAllTasks = async (
	
    filters: ITaskFilters,
	paginationOptions: IPaginationOptions

) => {

	const { searchTerm, isPublished, ...filterData } = filters;
	const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const andConditions: Prisma.TaskWhereInput[] = [
        {
            isPublished: isPublished !== undefined ? true : false
        }
    ];

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

	const whereConditions: Prisma.TaskWhereInput = andConditions.length? { AND: andConditions } : {};

	const orderBy = { [sortBy]: sortOrder } as Prisma.TaskOrderByWithRelationInput;

	const result = await prisma.task.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy,
	});

	const total = await prisma.task.count({ where: whereConditions });

	return {
		meta: { page, limit, total },
		data: result,
	};
};

const getTaskById = async (id: string) => {
	
    const task = await prisma.task.findUnique({
		where: { id },
		include: {
			steps: {
				orderBy: {
					order: 'asc',
				},
			},
		},
	});

	if (!task) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
	}

	return task;
};

const createTask = async (payload: ICreateTaskPayload) => {
	
    const taskCreateData: Prisma.TaskCreateInput = {
		title: payload.title,
		...(payload.description !== undefined ? { description: payload.description } : {}),
		...(payload.category !== undefined ? { category: payload.category } : {}),
		...(payload.isPublished !== undefined ? { isPublished: payload.isPublished } : {}),
	};

	const createdTask = await prisma.task.create({
		data: taskCreateData
	});

	return createdTask;
};

const updateTaskById = async (id: string, payload: IUpdateTaskPayload) => {
	

	const existingTask = await prisma.task.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existingTask) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
	}

	const result= await prisma.task.update({
        where: { id },
        data: {
            ...(payload.title !== undefined ? { title: payload.title } : {}),
            ...(payload.description !== undefined ? { description: payload.description } : {}),
            ...(payload.category !== undefined ? { category: payload.category } : {}),
            ...(payload.isPublished !== undefined ? { isPublished: payload.isPublished } : {})
        }
    });

	return result;
};

const deleteTaskById = async (id: string) => {
	
    const existingTask = await prisma.task.findUnique({
		where: { id,isPublished:true },
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
