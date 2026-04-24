import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.patch(
	'/:id',
	validateRequest(AdminValidation.updateAdminSchema),
	AdminController.updateAdminById
);
router.delete('/:id', AdminController.deleteAdminById);

export const adminRoutes = router;
