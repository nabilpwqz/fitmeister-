import { Router } from 'express';
import { RoomsController } from './rooms.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/', RoomsController.getAll);
router.get('/:id', RoomsController.getById);
router.post('/', requireAuth, requireRole(['HOST', 'ADMIN']), RoomsController.create);
router.patch('/:id', requireAuth, requireRole(['HOST', 'ADMIN']), RoomsController.update);
router.delete('/:id', requireAuth, requireRole(['HOST', 'ADMIN']), RoomsController.delete);

export default router;
