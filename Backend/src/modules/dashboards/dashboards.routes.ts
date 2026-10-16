import { Router } from 'express';
import { DashboardsController } from './dashboards.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/customer', DashboardsController.getCustomerDashboard);
router.get('/host', requireRole(['HOST', 'ADMIN']), DashboardsController.getHostDashboard);
router.get('/admin', requireRole(['ADMIN']), DashboardsController.getAdminDashboard);
router.patch('/admin/rooms/:roomId/moderate', requireRole(['ADMIN']), DashboardsController.moderateRoom);
router.patch('/admin/users/:userId/role', requireRole(['ADMIN']), DashboardsController.changeUserRole);

export default router;
