import { fileUtils } from '../utils/fileUtil.js';
import { Article } from './databaseService.js';
import { standardizeDate } from '../utils/dateUtil.js';
import { duplicateDate } from '../utils/duplicateCheck.js';
import  axios from 'axios';
import dotenv from 'dotenv'; 
dotenv.config();
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.SECRET_KEY}`;

// need file utility
// this needs to fetch and save news, but should have another function to pull from db

export async function fetchAndSaveNews() {
  console.log("BEFORE DUPLICATE DATE CHECK");
  const duplicateResult = await duplicateDate();
  console.log("DUPLICATE CHECK RESULT:", duplicateResult);
  if (!duplicateResult){
    console.log("I PASSED THE DUPLICATE CHECK");
    try {
      const response = await axios.get(NEWS_API_URL);
      const data = response.data;
      
      // Check if NewsAPI returned an error
      if (data.status === 'error') {
        console.error('NewsAPI error:', data.message);
        // Save the error response to JSON for debugging
        fileUtils.saveNewsToFile(data);
        return null;
      }
      
      console.log('Successfully fetched news, saving to JSON...');
      fileUtils.saveNewsToFile(data);
      
      //console.log('Inserting articles into database...');
      for (const article of data.articles) {
        try {
          await Article.create(
            article.title, 
            article.description || 'Unknown', 
            article.author || 'Unknown', 
            article.source?.name || 'Unknown', 
            article.url, 
            article.content, 
            article.publishedAt
          )
          console.log('Successfully inserted article:', article.title);
        } catch (dbError) {
          console.error('Database insertion error for article:', article.title, dbError);
        }
      }
      console.log('Successfully saved to database');
      // Return articles from database instead of NewsAPI response
      try {
        const dbArticles = await Article.findByDate(standardizeDate());
        console.log('Retrieved articles from database:', dbArticles.length);
        return dbArticles;
      } catch (dbError) {
        console.error('Error retrieving articles from database:', dbError);
        return [];
      }
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
      
      fileUtils.saveNewsToFile(data);
      return null;
    }
  } else {
    console.log("NewsAPI already called, returning articles from database");
    return await Article.findByDate(standardizeDate());
  }
}