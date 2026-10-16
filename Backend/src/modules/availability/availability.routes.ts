import { Router } from 'express';
import { AvailabilityController } from './availability.controller';

const router = Router();

router.get('/:roomId', AvailabilityController.getRoomAvailability);

export default router;
