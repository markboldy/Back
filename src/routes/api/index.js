import { Router } from 'express';
import usersRoutes from './users';
import groupsRoutes from './groups';
const router = Router();

router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
/**
 * @openapi
 * /api/v1/healthcheck:
 *  get:
 *    tags:
 *      - healthcheck
 *    description: Responds if app is up and running
 *    responses:
 *      200:
 *        description: App is up and running
 */
router.use('/api/v1/healthcheck', (_, res) => res.sendStatus(200))

export default router;
