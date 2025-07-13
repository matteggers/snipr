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

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export default pool;