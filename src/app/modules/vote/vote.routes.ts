import express from 'express';
import { VoteController } from './vote.controller';

const router = express.Router();

router.post(
	'/',
	VoteController.createVote
);

router.delete(
	'/',
	VoteController.deleteVote
);

export const voteRoutes = router;
