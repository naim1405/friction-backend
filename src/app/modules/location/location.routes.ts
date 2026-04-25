import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { LocationController } from './location.controller';
import { LocationValidation } from './location.validation';

const router = express.Router();

router.get('/', LocationController.getAllLocations);
router.get('/:id', LocationController.getLocationById);
router.post(
	'/',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(LocationValidation.createLocationSchema),
	LocationController.createLocation
);

export const locationRoutes = router;
