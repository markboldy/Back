import express from 'express';
import { createGroup, deleteGroupById, getAllGroups, getGroupById, patchGroupById } from '../../controllers/group';
import { addGroupMember, deleteGroupMember, getGroupMembers, patchGroupMember } from '../../controllers/members';
import { addGroupExpense, deleteGroupExpense, updateGroupExpense } from '../../controllers/expense';
import { getGroupHistory } from '../../controllers/history';

const router = express.Router();

// groups crud
router.get('/', getAllGroups);
router.get('/:groupId', getGroupById);
router.post('/', createGroup);
router.patch('/:groupId', patchGroupById);
router.delete('/:groupId', deleteGroupById);

// members crud
router.get('/:groupId/members', getGroupMembers);
router.post('/:groupId/members', addGroupMember);
router.patch('/:groupId/members/:memberId', patchGroupMember);
router.delete('/:groupId/members/:memberId', deleteGroupMember);

// expenses crud
router.post('/:groupId/expenses', addGroupExpense);
router.patch('/:groupId/expenses/:expenseId', updateGroupExpense);
router.delete('/:groupId/expenses/:expenseId', deleteGroupExpense);

// history
router.get('/:groupId/history', getGroupHistory)

export default router;
