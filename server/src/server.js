import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import './config/database.js';
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mount news routes
app.use('/api/news', newsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/* 
Hi future me. This looks like a mess right.
Routes handle the frontend, then hand to controllers which grab business logic from the services. the services use utilites to assist in their function.

What do you need to do now?
Add an ID column in SQL DB for indexing. Fix linking to frontend (just rewrite it yourself at this point, it's good practice and you need it)
Fix warnings about es module reparsing and commonjs parsing.

*/