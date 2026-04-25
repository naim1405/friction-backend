import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

const router = express.Router();

router.post(
	'/',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
	validateRequest(CommentValidation.createCommentSchema),
	CommentController.createComment
);

router.get(
	'/',
	CommentController.getComments
);

router.delete(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
	CommentController.deleteCommentById
);

export const commentRoutes = router;
