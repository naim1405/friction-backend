import express from 'express';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';
import { UserRole } from '../../../generated/prisma/browser';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post(
	'/',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(TaskValidation.createTaskSchema),
	TaskController.createTask
);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(TaskValidation.updateTaskSchema),
	TaskController.updateTaskById
);
router.delete(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	TaskController.deleteTaskById
);

export const taskRoutes = router;
