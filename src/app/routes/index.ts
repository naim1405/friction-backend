import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { taskRoutes } from '../modules/task/task.routes';
import { stepRoutes } from '../modules/step/step.routes';
import { locationRoutes } from '../modules/location/location.routes';
import { voteRoutes } from '../modules/vote/vote.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/tasks',
    route: taskRoutes,
  },
  {
    path: '/steps',
    route: stepRoutes,
  },
  {
	path: '/locations',
	route: locationRoutes,
  },
  {
	path: '/votes',
	route: voteRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
