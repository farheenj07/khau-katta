import bcrypt from 'bcryptjs';
import { getPool, migrateAuthentication } from '../data/postgres';

const required = ['SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD', 'SEED_VENDOR_EMAIL', 'SEED_VENDOR_PASSWORD', 'SEED_RIDER_EMAIL', 'SEED_RIDER_PASSWORD'] as const;
const missing = required.filter(name => !process.env[name]);
if (missing.length) { console.error(`Seed aborted: missing required environment variables: ${missing.join(', ')}`); process.exit(1); }

async function upsertAccount(id: string, roleId: string, name: string, email: string, password: string, phone: string) {
  const hash = await bcrypt.hash(password, 12);
  await getPool().query(`INSERT INTO users (id, role_id, name, email, phone, password_hash, status) VALUES ($1,$2,$3,$4,$5,$6,'active') ON CONFLICT (email) DO UPDATE SET role_id=EXCLUDED.role_id, name=EXCLUDED.name, password_hash=EXCLUDED.password_hash, status='active', updated_at=NOW()`, [id, roleId, name, email, phone, hash]);
}
async function seed() {
  await migrateAuthentication();
  await upsertAccount('usr-admin-01', 'role-admin-002', 'Development Admin', process.env.SEED_ADMIN_EMAIL!, process.env.SEED_ADMIN_PASSWORD!, '9000000001');
  await upsertAccount('usr-owner-01', 'role-owner-004', 'Development Vendor', process.env.SEED_VENDOR_EMAIL!, process.env.SEED_VENDOR_PASSWORD!, '9000000002');
  await upsertAccount('usr-deliv-01', 'role-deliv-003', 'Development Rider', process.env.SEED_RIDER_EMAIL!, process.env.SEED_RIDER_PASSWORD!, '9000000003');
  console.log('Development authentication accounts seeded.');
}
seed().catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
