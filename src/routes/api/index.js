import { Router } from 'express';
import usersRoutes from './users';
import groupsRoutes from './groups';
const router = Router();

router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);

export default router;
