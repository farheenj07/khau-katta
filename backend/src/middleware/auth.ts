import { Request, Response, NextFunction } from 'express';
import { users, roles } from '../data/db';
import { User, UserRole } from '../types';

export interface AuthRequest extends Request {
  user?: User & { roleName: UserRole };
}

// Helper to generate a secure session token
export function generateToken(user: User, roleName: UserRole): string {
  const payload = {
    uid: user.id,
    role: roleName,
    phone: user.phone,
    ts: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Helper to decode and verify token
export function verifyToken(token: string): { uid: string; role: UserRole } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.uid || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return next();
  }

  const user = users.find(u => u.id === decoded.uid);
  if (!user) {
    return next();
  }

  const role = roles.find(r => r.id === user.roleId);
  req.user = {
    ...user,
    roleName: (role?.name || decoded.role) as UserRole
  };

  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with your mobile OTP or credentials.'
    });
  }
  next();
}

export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roleList.includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires ${roleList.join(' or ')} role. Your current role is ${req.user.roleName}.`
      });
    }

    next();
  };
}
