import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_roxiler_2025_secure',
  dbFile: process.env.DATABASE_FILE || 'roxiler.sqlite',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
