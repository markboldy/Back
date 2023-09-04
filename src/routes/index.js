import { Router } from 'express';
import localAuthRoutes from './localAuth';
import googleAuthRoutes from './googleAuth';
import facebookAuthRoutes from './facebookAuth';
import apiRoutes from './api';
const router = Router();

router.use('/api/v1/auth', localAuthRoutes);
router.use('/api/v1/auth', googleAuthRoutes);
router.use('/api/v1/auth', facebookAuthRoutes);
router.use('/api/v1', apiRoutes);
// fallback 404
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default router;
