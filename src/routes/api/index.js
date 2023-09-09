import { Router } from 'express';
import usersRoutes from './users';
import groupsRoutes from './groups';
const router = Router();

router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/api/v1/healthcheck', (_, res) => res.sendStatus(200))

export default router;
