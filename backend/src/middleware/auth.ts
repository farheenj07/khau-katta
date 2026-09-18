import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserRole } from '../types';
import { findAuthUserById } from '../data/postgres';

export interface AuthRequest extends Request {
  user?: User & { roleName: UserRole };
}

// Helper to generate a secure session token
const TOKEN_EXPIRY = '8h';
const validRoles: UserRole[] = ['customer', 'admin', 'delivery_partner', 'stall_owner'];

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured and contain at least 32 characters.');
  }
  return secret;
}

/** Called during startup so insecure configuration never accepts requests. */
export function assertAuthConfiguration(): void {
  getJwtSecret();
}

export function generateToken(user: User, roleName: UserRole): string {
  return jwt.sign(
    { uid: user.id, role: roleName },
    getJwtSecret(),
    { algorithm: 'HS256', expiresIn: TOKEN_EXPIRY }
  );
}

// Verify, rather than merely decode, the bearer token. The role is checked as
// a claim and is always re-derived from the server-side user record below.
export function verifyToken(token: string): { uid: string; role: UserRole } | null {
  try {
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as JwtPayload;
    if (typeof payload.uid !== 'string' || !validRoles.includes(payload.role as UserRole)) return null;
    return { uid: payload.uid, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication requires a Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }

  let user;
  try {
    user = await findAuthUserById(decoded.uid);
  } catch {
    return res.status(503).json({ success: false, message: 'Authentication service temporarily unavailable.' });
  }
  if (!user || user.status !== 'active') {
    return res.status(401).json({ success: false, message: 'Authentication session is no longer valid.' });
  }

  req.user = {
    ...user,
    roleName: user.roleName
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
