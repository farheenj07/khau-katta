import { migrateAuthentication } from '../data/postgres';
migrateAuthentication().then(() => console.log('Authentication migrations completed.')).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
