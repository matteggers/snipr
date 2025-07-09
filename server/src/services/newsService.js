
// import stuff
import { Article } from './databaseService.js';
const axios = require('axios'); 
require('dotenv').config();
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.SECRET_KEY}`;

// need file utility


async function fetchAndSaveNews() {
  try {
    
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
    
    //console.log('Inserting articles into database...');
    for (const article of data.articles) {
      try {
        Article.create(article.title, article.description, article.content, article.LINK, article.author)
        console.log('Successfully inserted article:', article.title);
      } catch (dbError) {
        console.error('Database insertion error for article:', article.title, dbError);
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

module.exports = { fetchAndSaveNews };