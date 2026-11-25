
import dotenv from 'dotenv';

if (!process.env.NETLIFY) {
  dotenv.config({ path: 'server/.env' });
}
