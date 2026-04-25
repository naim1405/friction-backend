import express from 'express';
import { VoteController } from './vote.controller';
import { UserRole } from '../../../generated/prisma/browser';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
	'/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
	VoteController.createVote
);

router.delete(
	'/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
	VoteController.deleteVote
);

export const voteRoutes = router;
