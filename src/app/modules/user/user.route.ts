import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/admin',
  validateRequest(UserValidation.createdAdminSchema),
  UserController.createAdmin
);

router.post(
  '/customer',
  validateRequest(UserValidation.createdCustomerSchema),
  UserController.createCustomer
);

export const userRoutes = router;
