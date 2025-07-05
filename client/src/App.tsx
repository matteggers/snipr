import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import ArticleList from './ArticleList';
import { filterArticles, useArticleActions } from './articleUtils';

const VIEW_TITLES: Record<string, string> = {
  todays: "Today's Tech News",
  all: 'All Articles',
  liked: 'Liked Articles',
  disliked: 'Disliked Articles',
  readLater: 'Read Later Articles',
};

function App() {
  const [hasCalledToday, setHasCalledToday] = useState<boolean | null>(null);
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'all' | 'liked' | 'disliked' | 'readLater' | 'todays'>('todays');
  const [testMode, setTestMode] = useState(false);

  const { liked, disliked, readLater, handleLike, handleDislike, handleReadLater } = useArticleActions();

  const handleFetchNews = async () => {
    setLoading(true);
    try {
      if (testMode) {
        // Use test endpoint for local JSON
        console.log('Making request to /api/test-local');
        const res = await fetch('http://localhost:4000/api/test-local');
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const text = await res.text();
        console.log('Response text:', text);
        
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        
        setNews(data.news);
        setHasCalledToday(true);
      } else {
        // Normal flow: fetch from API, then get from DB
        const fetchRes = await fetch('http://localhost:4000/api/fetch-news', { method: 'POST' });
        if (!fetchRes.ok) {
          throw new Error(`HTTP error! status: ${fetchRes.status}`);
        }
        const res = await fetch('http://localhost:4000/api/has-called-today');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setNews(data.news);
        setHasCalledToday(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error fetching news: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const articlesToShow = filterArticles(news, liked, disliked, readLater, view);

  return (
    <div className="App app-flex">
      <Sidebar setView={setView} />
      <main className="main-content">
        <div className='title'>
          <h1>{VIEW_TITLES[view]}</h1>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button onClick={handleFetchNews} style={{ padding: '10px 24px', fontSize: '1rem', borderRadius: 6, background: '#4a4e69', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 10 }}>
            {testMode ? 'Load Test Data' : 'Fetch New News'}
          </button>
          <button 
            onClick={() => setTestMode(!testMode)} 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.9rem', 
              borderRadius: 4, 
              background: testMode ? '#e74c3c' : '#27ae60', 
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            {testMode ? 'Exit Test Mode' : 'Test Mode'}
          </button>
          {testMode && (
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#666' }}>
              Test Mode: Using local JSON data
            </div>
          )}
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : hasCalledToday || news ? (
          <ArticleList
            articles={articlesToShow}
            liked={liked}
            disliked={disliked}
            readLater={readLater}
            onLike={handleLike}
            onDislike={handleDislike}
            onReadLater={handleReadLater}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            Click "{testMode ? 'Load Test Data' : 'Fetch New News'}" to get today's tech headlines
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

/*
  Visual: 
  Today's Tech News - centered large text
  check if checked for tech news so far
  Article titles shown below it
  Can expand to show the article
  Like, dislike, read receipt
  

*/
