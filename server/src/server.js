require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // wont need this soon
const axios = require('axios');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const api_key = process.env.SECRET_KEY;
const pg_user = process.env.PG_USER;
const pg_pass = process.env.PG_PASS;
const db_name = process.env.DB_NAME;
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${api_key}`;

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

app.use(express.json()); // Add this to parse JSON bodies

// ONLY CALL WHEN C&B HAVE BEEN CONDUCTED
// Helper function to fetch news from NewsAPI and save to JSON
async function fetchAndSaveNews() {
  try {
    const response = await axios.get(NEWS_API_URL);
    const data = await response.json();
    fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(data, null, 2));
    // TODO: Store in Postgres DB as well
    return data;
  } catch (err) {
    console.error('Error fetching news:', err);
    return null;
  }
}

// FIXME Don't need to call fileDate, can parse through the file name for that. 
// Endpoint to check if API has been called today and return news
app.get('/api/has-called-today', async (req, res) => {
  // Check if the JSON file exists and is from today
  // JSONS will be deleted after placed into sql so why are you checking lol

    // Get todays date and query it
    // PG gives dates like: "2025-06-23 15:11:16.973997"
    const today = date_converter(new Date());
    
    // this will get way less efficient (I think) if it were scaled to large numbers
    const { rows } = await pool.query(
      `SELECT * 
        from snipr_articles 
        WHERE createdat::created_at = $1`, 
        [ today ]
    );

    if (rows.length > 0) {
      console.log("API has already been called today");
      // display the data
    } else {
        const news = await fetchAndSaveNews();
      if (news) {
        return res.json({ hasCalledToday: false, news });
      } else {
        return res.status(500).json({ error: 'Failed to fetch news' });
      }
    }
});

// Endpoint to force fetch news from API (e.g., button click)
app.post('/api/fetch-news', async (req, res) => {
  // Always fetch from NewsAPI, save, and return
  const news = await fetchAndSaveNews();
  if (news) {
    return res.json({ news });
  } else {
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Like an article
app.post('/api/like', async (req, res) => {
  const { article } = req.body;
  try {
    await Pool.query(
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
    await Pool.query(
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
    await Pool.query(
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

  return (`${year}-${month}-${day}`);
}




/* 
  Call {has it been called today}. If not, pull data, place into json, read from json onto screen, write into SQL DB. Take feedback from user.
  TODO: If an article is disliked, remove it from user view
  Dislike existing style. Shouldn't directly call the API when asked, should check if a file exists. Or some table? Investigate
  UI also has "todays news" button on same screen that todays news is shown on. don't like that
  Currently have runtime errors (ReacT), errors parsing json data (not even running node or pg lol)
  // I didn't even include an author column lol

*/