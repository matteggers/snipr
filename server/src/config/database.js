import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  max: 10,           
  idleTimeoutMillis: 30000,  
  connectionTimeoutMillis: 2000,
});

export default pool;