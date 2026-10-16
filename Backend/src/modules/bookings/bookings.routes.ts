import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', BookingsController.create);
router.get('/my', BookingsController.getMyBookings);
router.get('/:id', BookingsController.getById);
router.patch('/:id/cancel', BookingsController.cancel);

export default router;
