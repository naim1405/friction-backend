import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/browser';

const router = express.Router();

router.post(
  '/admin',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.createdAdminSchema),
  UserController.createAdmin
);

router.post(
  '/customer',
  validateRequest(UserValidation.createdCustomerSchema),
  UserController.createCustomer
);

export const userRoutes = router;
