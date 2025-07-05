require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // wont need this soon
const axios = require('axios');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const api_key = process.env.SECRET_KEY;
const pg_user = process.env.PG_USER;
const pg_pass = process.env.PG_PASS;
const db_name = process.env.DB_NAME;

// Debug: Log the API key (masked for security)
console.log('API Key loaded:', api_key ? `${api_key.substring(0, 8)}...` : 'NOT FOUND');
console.log('API Key length:', api_key ? api_key.length : 0);

const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${api_key}`;

// Debug: Log the URL (without the key for security)
console.log('NewsAPI URL (without key):', `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=[HIDDEN]`);

const currentDate = new Date();
const fileDate = currentDate.getFullYear() + '-' + currentDate.getDate(); // ex: YYYY-M-D, month doesnt automatically include leading zero for 0->9, same for day. 

const app = express();
const port = process.env.PORT || 4000; // port for node server

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: db_name,
  user: pg_user,
  password: pg_pass,
  max: 10,           
  idleTimeoutMillis: 30000,  
  connectionTimeoutMillis: 2000,
});
const NEWS_JSON_PATH = path.join(__dirname, `${fileDate}.json`);

app.use(cors()); // cors lets frontend talk to backend with diff ports
app.use(express.json()); // parse jsons

// ONLY CALL WHEN C&B HAVE BEEN CONDUCTED
// Helper function to fetch news from NewsAPI, save to JSON, and insert into DB
async function fetchAndSaveNews() {
  try {
    console.log('Fetching news from NewsAPI...');
    const response = await axios.get(NEWS_API_URL);
    const data = response.data;
    
    // Check if NewsAPI returned an error
    if (data.status === 'error') {
      console.error('NewsAPI error:', data.message);
      // Save the error response to JSON for debugging
      fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(data, null, 2));
      return null;
    }
    
    console.log('Successfully fetched news, saving to JSON...');
    fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(data, null, 2));
    
    // Insert each article into the DB
    console.log('Inserting articles into database...');
    for (const article of data.articles) {
      try {
        await pool.query(
          'INSERT INTO articles (title, first_paragraph, created_at, content, LINK) VALUES ($1, $2, NOW(), $3, $4)',
          [article.title, article.description, article.content, article.url]
        );
        console.log('Successfully inserted article:', article.title);
      } catch (dbError) {
        console.error('Database insertion error for article:', article.title, dbError);
        // Continue with other articles even if one fails
      }
    }
    console.log('Successfully saved to database');
    return data;
  } catch (err) {
    console.error('Error fetching news:', err);
    
    // Save error details to JSON for debugging
    const errorData = {
      error: true,
      message: err.message,
      timestamp: new Date().toISOString(),
      details: err.response ? {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      } : null
    };
    
    fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(errorData, null, 2));
    return null;
  }
}

// TEMPORARY: Helper function to read news from local JSON file (for testing)
async function readFromLocalJSON() {
  try {
    // First try the date-based file
    if (fs.existsSync(NEWS_JSON_PATH)) {
      const data = JSON.parse(fs.readFileSync(NEWS_JSON_PATH, 'utf-8'));
      console.log('Reading from date-based JSON file for testing');
      return data;
    } 
    // Fallback to test file
    else if (fs.existsSync(path.join(__dirname, 'test-news.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-news.json'), 'utf-8'));
      console.log('Reading from test-news.json for testing');
      return data;
    } else {
      console.log('No local JSON files found');
      return null;
    }
  } catch (err) {
    console.error('Error reading local JSON:', err);
    return null;
  }
}

// TEMPORARY: Endpoint to read from local JSON (for testing)
app.get('/api/test-local', async (req, res) => {
  try {
    const news = await readFromLocalJSON();
    if (news) {
      return res.json({ hasCalledToday: true, news });
    } else {
      return res.status(404).json({ error: 'No local news file found' });
    }
  } catch (err) {
    console.error('Test endpoint error:', err);
    return res.status(500).json({ error: 'Server error reading test data' });
  }
});

// Endpoint to check if API has been called today and return news
app.get('/api/has-called-today', async (req, res) => {
  const today = date_converter(new Date());
  try {
    const { rows } = await pool.query(
      `SELECT * FROM articles WHERE DATE(created_at) = $1`,
      [today]
    );
    if (rows.length > 0) {
      // Return today's articles from DB
      return res.json({ hasCalledToday: true, news: { articles: rows } });
    } else {
      const news = await fetchAndSaveNews();
      if (news) {
        return res.json({ hasCalledToday: false, news });
      } else {
        return res.status(500).json({ error: 'Failed to fetch news' });
      }
    }
  } catch (err) {
    console.error('API has been called error', err);
    res.status(500).json({ error: 'API has been called error' });
  }
});

// Endpoint to force fetch news from API (e.g., button click)
app.post('/api/fetch-news', async (req, res) => {
  try {
    console.log('Fetch-news endpoint called');
    
    // Check if articles already exist for today
    const today = date_converter(new Date());
    const { rows } = await pool.query(
      `SELECT * FROM articles WHERE DATE(created_at) = $1`,
      [today]
    );
    
    if (rows.length > 0) {
      console.log('Articles already exist for today, returning existing data');
      return res.json({ news: { articles: rows } });
    }
    
    // Only fetch from API if no articles exist for today
    console.log('No articles found for today, fetching from API');
    const news = await fetchAndSaveNews();
    if (news) {
      return res.json({ news });
    } else {
      // Check if there's an error file we can read
      if (fs.existsSync(NEWS_JSON_PATH)) {
        const errorData = JSON.parse(fs.readFileSync(NEWS_JSON_PATH, 'utf-8'));
        if (errorData.error) {
          return res.status(500).json({ 
            error: 'Failed to fetch news', 
            details: errorData.message,
            apiError: errorData.details
          });
        }
      }
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  } catch (err) {
    console.error('Fetch-news endpoint error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Like an article
app.post('/api/like', async (req, res) => {
  const { article } = req.body;
  try {
    await pool.query(
      'INSERT INTO likes (title, description) VALUES ($1, $2) ON CONFLICT (title) DO NOTHING',
      [article.title, article.description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Dislike an article
app.post('/api/dislike', async (req, res) => {
  const { article } = req.body;
  try {
    await pool.query(
      'INSERT INTO dislikes (title, description) VALUES ($1, $2) ON CONFLICT (title) DO NOTHING',
      [article.title, article.description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Dislike error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Read later an article
// FIXME Not in current pg instance
app.post('/api/read-later', async (req, res) => {
  const { article } = req.body;
  try {
    await pool.query(
      'INSERT INTO read_later (title, description) VALUES ($1, $2) ON CONFLICT (title) DO NOTHING',
      [article.title, article.description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Read later error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const date_converter = (js_date) => {
  // PG gives dates like: "2025-06-23 15:11:16.973997" can I remove time?
  // JS gives dates like: 2025-6-1. Need leading zeros for months and dates
  const currentDate = new Date();
  let month = currentDate.getMonth() + 1; // given as 0-11
  const day = currentDate.getDate(); 
  const year = currentDate.getFullYear();
  month = (month < 10) ? ('0' + month) : month;
  day = (day < 10) ? ('0' + day) : day;
  return (`${year}-${month}-${day}`);
}




/* 
  TODO:
  Add: Author column to DB, read later column to db, 'read' column to db, more robust error handling, sql injection protection (not even needed this is a local project lol but good practice),
  Also work on the frontend now bc of the json runtime error. Then work on the above features.

*/