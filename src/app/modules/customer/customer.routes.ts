import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../../../generated/prisma/browser';
import auth from '../../middlewares/auth';
import { customerController } from './customer.controller';
import { customerValidation } from './customer.validation';

const router = express.Router();

router.get('/',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), customerController.getAllCustomer);
router.get('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), customerController.getCustomerById);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(customerValidation.updateCustomerSchema),
	customerController.updateCustomerById
);
router.delete('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), customerController.deleteCustomerById);

export const customerRoutes = router;
