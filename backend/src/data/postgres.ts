import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured. PostgreSQL authentication cannot fall back to in-memory data.');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

export async function migrateAuthentication(): Promise<void> {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS roles (id VARCHAR(36) PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE, description TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, role_id VARCHAR(36) NOT NULL REFERENCES roles(id), name VARCHAR(100) NOT NULL, email VARCHAR(150) UNIQUE, phone VARCHAR(20) UNIQUE NOT NULL, password_hash VARCHAR(255), status VARCHAR(20) DEFAULT 'active', avatar_url TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS otp_verifications (id VARCHAR(36) PRIMARY KEY, phone VARCHAR(20) NOT NULL, otp_code VARCHAR(6), otp_hash VARCHAR(255), expires_at TIMESTAMPTZ NOT NULL, is_verified BOOLEAN DEFAULT FALSE, attempts INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
    ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS otp_hash VARCHAR(255);
    ALTER TABLE otp_verifications ALTER COLUMN otp_code DROP NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_otp_phone_created ON otp_verifications(phone, created_at DESC);
  `);
  await db.query(`INSERT INTO roles (id, name, description) VALUES
    ('role-cust-001','customer','End consumer'),
    ('role-admin-002','admin','Platform administrator'),
    ('role-deliv-003','delivery_partner','Delivery partner'),
    ('role-owner-004','stall_owner','Stall owner')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`);
}

export type DbUser = { id: string; roleId: string; roleName: 'customer' | 'admin' | 'delivery_partner' | 'stall_owner'; name: string; email?: string; phone: string; status: 'active' | 'inactive' | 'suspended' | 'pending'; avatarUrl?: string; createdAt: string; updatedAt: string; passwordHash?: string };

function mapUser(row: Record<string, unknown>): DbUser {
  return { id: String(row.id), roleId: String(row.role_id), roleName: row.role_name as DbUser['roleName'], name: String(row.name), email: row.email ? String(row.email) : undefined, phone: String(row.phone), status: row.status as DbUser['status'], avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined, createdAt: new Date(String(row.created_at)).toISOString(), updatedAt: new Date(String(row.updated_at)).toISOString(), passwordHash: row.password_hash ? String(row.password_hash) : undefined };
}

const userFields = `u.id, u.role_id, r.name AS role_name, u.name, u.email, u.phone, u.status, u.avatar_url, u.created_at, u.updated_at, u.password_hash`;
export async function findAuthUserById(id: string) { const result = await getPool().query(`SELECT ${userFields} FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=$1`, [id]); return result.rows[0] ? mapUser(result.rows[0]) : undefined; }
export async function findAuthUser(identifier: string, role: DbUser['roleName']) { const result = await getPool().query(`SELECT ${userFields} FROM users u JOIN roles r ON r.id=u.role_id WHERE r.name=$2 AND (LOWER(u.email)=LOWER($1) OR regexp_replace(u.phone, '\\D','','g')=$3)`, [identifier.trim(), role === 'customer' ? identifier : identifier.replace(/\D/g, '').slice(-10)]); return result.rows[0] ? mapUser(result.rows[0]) : undefined; }
export async function createCustomer(name: string, phone: string, email?: string) {
  const db = getPool(); const id = `usr-cust-${crypto.randomUUID()}`;
  const result = await db.query(`INSERT INTO users (id,role_id,name,email,phone,status) VALUES ($1,'role-cust-001',$2,$3,$4,'active') RETURNING id`, [id, name, email || null, phone]);
  return findAuthUserById(result.rows[0].id);
}
