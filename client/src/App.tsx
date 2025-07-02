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
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'all' | 'liked' | 'disliked' | 'readLater' | 'todays'>('todays');

  const { liked, disliked, readLater, handleLike, handleDislike, handleReadLater } = useArticleActions();

  useEffect(() => {
    // Fetch news from backend
    fetch('/api/has-called-today')
      .then(res => res.json())
      .then(data => {
        setHasCalledToday(data.hasCalledToday);
        setNews(data.news);
        setLoading(false);
      });
  }, []);

  const handleFetchNews = async () => {
    setLoading(true);
    await fetch('/api/fetch-news', { method: 'POST' });
    // After fetching, re-query for today's articles from the DB
    const res = await fetch('/api/has-called-today');
    const data = await res.json();
    setNews(data.news);
    setHasCalledToday(true);
    setLoading(false);
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
          <button onClick={handleFetchNews} style={{ padding: '10px 24px', fontSize: '1rem', borderRadius: 6, background: '#4a4e69', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Fetch New News
          </button>
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
          <div>
            <button onClick={handleFetchNews}>Fetch Today's News</button>
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
