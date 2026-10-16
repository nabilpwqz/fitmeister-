import { Request, Response, NextFunction } from 'express';
import { DashboardsService } from './dashboards.service';
import { z } from 'zod';

export class DashboardsController {
  static async getCustomerDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardsService.getCustomerDashboard(req.user!.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  static async getHostDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardsService.getHostDashboard(req.user!.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  static async getAdminDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardsService.getAdminDashboard();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  static async moderateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({ action: z.enum(['APPROVE', 'SUSPEND']) });
      const { action } = schema.parse(req.body);
      const room = await DashboardsService.adminModerateRoom(req.user!.id, req.params.roomId, action);
      return res.status(200).json({ success: true, message: `Room status updated to ${action}`, data: { room } });
    } catch (err) {
      return next(err);
    }
  }

  static async changeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({ role: z.enum(['CUSTOMER', 'HOST', 'ADMIN']) });
      const { role } = schema.parse(req.body);
      const user = await DashboardsService.adminChangeUserRole(req.user!.id, req.params.userId, role);
      return res.status(200).json({ success: true, message: `User role transitioned to ${role}`, data: { user } });
    } catch (err) {
      return next(err);
    }
  }
}
