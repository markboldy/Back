import { Router } from 'express';

import { deleteUser, getAllUsers, getAuthUser, getUserByUserName, updateUser } from '../../controllers/user';

const router = Router();

router.get('/', getAllUsers);
router.get('/:username', getUserByUserName);
router.get('/me', getAuthUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
