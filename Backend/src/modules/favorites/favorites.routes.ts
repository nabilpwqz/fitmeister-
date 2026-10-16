import { Router } from 'express';
import { FavoritesController } from './favorites.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', FavoritesController.getMine);
router.post('/toggle/:roomId', FavoritesController.toggle);

export default router;
