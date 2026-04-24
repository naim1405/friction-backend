import type { Request, Response } from 'express';
import httpStatus from '../../../const/httpStatus';

import { UserServices } from './user.service';
import catchAsync from '../../../lib/catchAsync';
import sendResponse from '../../../lib/sendResponse';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

export const UserController = {
  createAdmin,
};
