import express from 'express';
import { createGroup, deleteGroupById, getAllGroups, getGroupById, patchGroupById } from '../../controllers/group';

const router = express.Router();

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.post('/', createGroup);
router.patch('/:id', patchGroupById);
router.delete('/:id', deleteGroupById);

export default router;
