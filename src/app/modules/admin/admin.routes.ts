import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import { UserRole } from '../../../generated/prisma/browser';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.getAllAdmins);
router.get('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.getAdminById);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(AdminValidation.updateAdminSchema),
	AdminController.updateAdminById
);
router.delete('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.deleteAdminById);

export const adminRoutes = router;
