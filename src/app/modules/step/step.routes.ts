import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StepController } from './step.controller';
import { StepValidation } from './step.validation';

const router = express.Router();

router.post(
	'/',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(StepValidation.createStepSchema),
	StepController.createStep
);

router.get('/:id', StepController.getStepById);

router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(StepValidation.updateStepSchema),
	StepController.updateStepById
);

router.delete(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	StepController.deleteStepById
);

export const stepRoutes = router;
