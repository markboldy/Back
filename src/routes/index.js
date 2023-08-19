import { Router } from 'express';
import localAuthRoutes from './localAuth';
import googleAuthRoutes from './googleAuth';
import facebookAuthRoutes from './facebookAuth';
import apiRoutes from './api';
const router = Router();

router.use('/auth/v1', localAuthRoutes);
router.use('/auth/v1', googleAuthRoutes);
router.use('/auth/v1', facebookAuthRoutes);
router.use('/api/v1', apiRoutes);
// fallback 404
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default router;

/*
routes:

GET /auth/google
GET /auth/google/callback

GET /auth/facebook
GET /auth/facebook/callback

POST /auth/login
POST /auth/register
GET /auth/logout

GET api/users/me
GET /api/users/feature

*/
