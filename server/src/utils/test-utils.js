const fs = require('fs');
const path = require('path');

// Test utilities for development/debugging
const NEWS_JSON_PATH = path.join(__dirname, '..', 'data', 'news.json');

// Helper function to read news from local JSON file (for testing)
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

// Simple endpoint to read all articles from SQL DB (for testing)
async function getAllArticlesFromDB(pool) {
  try {
    const { rows } = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    console.log('Found', rows.length, 'articles in database');
    return { articles: rows };
  } catch (err) {
    console.error('SQL articles error:', err);
    throw err;
  }
}

module.exports = {
  readFromLocalJSON,
  getAllArticlesFromDB
}; 