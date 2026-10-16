import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.get('/room/:roomId', ReviewsController.getByRoom);
router.post('/', requireAuth, ReviewsController.create);

export default router;
