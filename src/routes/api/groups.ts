import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';

const router = Router();

router.get('/:id', requireJwtAuth, async (req, res) => {
//
})

export default router;
