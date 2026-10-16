import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, updateRoleSchema } from './auth.schemas';
import { env } from '../../config/env';

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);
      setAuthCookie(res, result.token);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      setAuthCookie(res, result.token);
      return res.status(200).json({
        success: true,
        message: 'Authenticated successfully',
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Session terminated and cookie cleared',
    });
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(200).json({ success: true, data: { user: null } });
      }
      const profile = await AuthService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data: { user: profile },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateRoleSchema.parse(req.body);
      const result = await AuthService.switchRole(req.user!.id, data.role);
      setAuthCookie(res, result.token);
      return res.status(200).json({
        success: true,
        message: `Account transitioned to role: ${data.role}`,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      return next(err);
    }
  }
}
