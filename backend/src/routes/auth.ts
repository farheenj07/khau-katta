import { Router, Request, Response } from 'express';
import { users, userAddresses } from '../data/db';
import { authenticate, requireAuth, generateToken, AuthRequest } from '../middleware/auth';
import { User } from '../types';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createCustomer, findAuthUser, getPool } from '../data/postgres';

const router = Router();

// 1. Send OTP to Customer Mobile Number
router.post('/send-otp', async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Mobile phone number is required.'
    });
  }

  // Clean phone number: remove +91, spaces, dashes
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 10-digit Indian mobile number.'
    });
  }

  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(otpCode, 12);
  await getPool().query(`INSERT INTO otp_verifications (id, phone, otp_hash, expires_at, is_verified, attempts) VALUES ($1,$2,$3,NOW() + INTERVAL '5 minutes',FALSE,0)`, [`otp-${crypto.randomUUID()}`, cleanPhone, otpHash]);
  if (process.env.NODE_ENV !== 'production') console.info(`[DEV ONLY] OTP for ${cleanPhone}: ${otpCode}`);
  return res.json({
    success: true,
    message: `OTP sent successfully to +91 ${cleanPhone}. Valid for 5 minutes.`,
    phone: cleanPhone,
    expiresIn: 300
  });
});

// 2. Verify OTP & Authenticate / Register Customer
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { phone, otp, name, email } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number and 6-digit OTP are required.'
    });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const db = getPool();
  const record = await db.query(`SELECT id, otp_hash, expires_at, attempts FROM otp_verifications WHERE phone=$1 AND is_verified=FALSE ORDER BY created_at DESC LIMIT 1`, [cleanPhone]);
  const otpRecord = record.rows[0];
  if (!otpRecord || new Date(otpRecord.expires_at) < new Date()) return res.status(400).json({ success: false, message: 'This OTP has expired. Please request a new OTP.' });
  if (otpRecord.attempts >= 5) return res.status(429).json({ success: false, message: 'Too many OTP attempts. Please request a new code.' });
  if (!await bcrypt.compare(otp, otpRecord.otp_hash)) { await db.query('UPDATE otp_verifications SET attempts=attempts+1 WHERE id=$1', [otpRecord.id]); return res.status(400).json({ success: false, message: 'Invalid OTP. Please verify and try again.' }); }
  await db.query('UPDATE otp_verifications SET is_verified=TRUE WHERE id=$1', [otpRecord.id]);
  let user = await findAuthUser(cleanPhone, 'customer');
  if (!user) user = await createCustomer(typeof name === 'string' && name.trim() ? name.trim() : `Customer ${cleanPhone.slice(-4)}`, cleanPhone, typeof email === 'string' ? email.trim() : undefined);
  if (!user) return res.status(500).json({ success: false, message: 'Unable to create customer account.' });
  const token = generateToken(user as User, 'customer');

  res.json({
    success: true,
    message: 'Authenticated successfully with Khau Katta!',
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: 'customer'
    }
  });
});

async function passwordLogin(req: Request, res: Response, role: 'admin' | 'stall_owner' | 'delivery_partner') {
  const identifier = typeof (req.body.identifier ?? req.body.email) === 'string' ? (req.body.identifier ?? req.body.email) : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const user = identifier && password ? await findAuthUser(identifier, role) : undefined;
  if (!user || !user.passwordHash || !await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ success: false, message: 'Invalid email/mobile number or password.' });
  if (user.status !== 'active') return res.status(403).json({ success: false, message: 'Your account is currently inactive. Please contact admin.' });
  const token = generateToken(user as User, role);
  return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatarUrl: user.avatarUrl, role } });
}
router.post('/admin/login', (req, res) => passwordLogin(req, res, 'admin').catch(() => res.status(503).json({ success: false, message: 'Authentication service temporarily unavailable.' })));
router.post('/vendor/login', (req, res) => passwordLogin(req, res, 'stall_owner').catch(() => res.status(503).json({ success: false, message: 'Authentication service temporarily unavailable.' })));
router.post('/delivery/login', (req, res) => passwordLogin(req, res, 'delivery_partner').catch(() => res.status(503).json({ success: false, message: 'Authentication service temporarily unavailable.' })));

// 4. Current Authenticated User Profile
router.get('/me', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const addresses = userAddresses.filter(a => a.userId === user.id);

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.roleName,
      addresses
    }
  });
});

// 5. Update Profile (Name & Avatar)
router.put('/profile', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { name, avatarUrl } = req.body;
  const user = users.find(u => u.id === req.user!.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (name && name.trim()) user.name = name.trim();
  if (avatarUrl) user.avatarUrl = avatarUrl;
  user.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    data: user
  });
});

// 6. User Saved Addresses
router.get('/addresses', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const addresses = userAddresses.filter(a => a.userId === req.user!.id);
  res.json({
    success: true,
    data: addresses
  });
});

router.post('/addresses', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { label, addressLine1, addressLine2, area, landmark, pincode, isDefault } = req.body;

  if (!addressLine1 || !area || !pincode) {
    return res.status(400).json({
      success: false,
      message: 'Address line, area, and pincode are required.'
    });
  }

  if (isDefault) userAddresses.filter(a => a.userId === req.user!.id).forEach(a => (a.isDefault = false));
  const newAddr = { id: `addr-${Date.now().toString().slice(-6)}`, userId: req.user!.id, label: label || 'Home', addressLine1, addressLine2, area, landmark, city: 'Belagavi', pincode, isDefault: Boolean(isDefault), createdAt: new Date().toISOString() };
  userAddresses.push(newAddr);

  res.json({
    success: true,
    message: 'Address saved successfully.',
    data: newAddr
  });
});

export default router;
