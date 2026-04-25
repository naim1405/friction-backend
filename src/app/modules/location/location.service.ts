import type { Prisma } from '../../../generated/prisma/client';
import httpStatus from '../../../const/httpStatus';
import type { IPaginationOptions } from '../../../interface/common';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { prisma } from '../../../lib/prisma';
import { locationSearchableFields } from './location.const';
import type {
  ICreateLocationPayload,
  ILocationFilters,
} from './location.interface';
import { fallbackLocations } from '../shohoj/shohoj.data';

const getFallbackLocations = (searchTerm?: string) => {
  const normalizedSearch = searchTerm?.trim().toLowerCase();

  return fallbackLocations
    .filter((location) => {
      if (!normalizedSearch) {
        return true;
      }

      return [location.name, location.address, location.city, location.type]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .map((location) => ({
      id: location.seedId,
      ...location,
    }));
};

const getAllLocations = async (
  filters: ILocationFilters,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: Prisma.LocationWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: locationSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.LocationWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.LocationOrderByWithRelationInput;

  try {
    let result = await prisma.location.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy,
    });

    let total = await prisma.location.count({ where: whereConditions });

    if (result.length === 0 && !Object.keys(filterData).length) {
      const fallbackResult = getFallbackLocations(searchTerm);

      result = fallbackResult as unknown as typeof result;
      total = fallbackResult.length;
    }

    return {
      meta: { page, limit, total },
      data: result,
    };
  } catch {
    const fallbackResult = getFallbackLocations(searchTerm);

    return {
      meta: { page, limit, total: fallbackResult.length },
      data: fallbackResult,
    };
  }
};

const getLocationById = async (id: string) => {
  const fallbackLocation = fallbackLocations.find(
    (location) => location.seedId === id
  );

  if (fallbackLocation) {
    return {
      ...fallbackLocation,
      steps: [],
    };
  }

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: {
          order: 'asc',
        },
        include: {
          task: true,
        },
      },
    },
  });

  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }

  return location;
};

const createLocation = async (payload: ICreateLocationPayload) => {
  const createdLocation = await prisma.location.create({
    data: {
      name: payload.name,
      latitude: payload.latitude,
      longitude: payload.longitude,
      ...(payload.address !== undefined ? { address: payload.address } : {}),
      ...(payload.city !== undefined ? { city: payload.city } : {}),
      ...(payload.country !== undefined
        ? { country: payload.country }
        : { country: 'Bangladesh' }),
      ...(payload.type !== undefined ? { type: payload.type } : {}),
      ...(payload.officeHours !== undefined
        ? { officeHours: payload.officeHours }
        : {}),
    },
  });

  return createdLocation;
};

export const LocationServices = {
  getAllLocations,
  getLocationById,
  createLocation,
};
