import { useState } from 'react';

type Article = {
  title: string;
  description: string;
};

async function postAction(endpoint: string, article: Article) {
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article }),
  });
}

export function useArticleActions() {
  const [liked, setLiked] = useState<Article[]>([]);
  const [disliked, setDisliked] = useState<Article[]>([]);
  const [readLater, setReadLater] = useState<Article[]>([]);

  const handleLike = async (article: Article) => {
    if (!liked.find(a => a.title === article.title)) {
      setLiked([...liked, article]);
      setDisliked(disliked.filter(a => a.title !== article.title));
      await postAction('/api/like', article);
    }
  };

  const handleDislike = async (article: Article) => {
    if (!disliked.find(a => a.title === article.title)) {
      setDisliked([...disliked, article]);
      setLiked(liked.filter(a => a.title !== article.title));
      await postAction('/api/dislike', article);
    }
  };

  const handleReadLater = async (article: Article) => {
    if (!readLater.find(a => a.title === article.title)) {
      setReadLater([...readLater, article]);
      await postAction('/api/read-later', article);
    }
  };

  return { liked, disliked, readLater, handleLike, handleDislike, handleReadLater };
}

export function filterArticles(news: any, liked: Article[], disliked: Article[], readLater: Article[], view: string): Article[] {
  console.log('filterArticles called with:');
  console.log('news:', news);
  console.log('news.articles:', news?.articles);
  console.log('view:', view);
  console.log('liked:', liked);
  console.log('disliked:', disliked);
  console.log('readLater:', readLater);
  
  if (!news || !news.articles) {
    console.log('Returning empty array because news or news.articles is null/undefined');
    return [];
  }
  
  console.log('news.articles length:', news.articles.length);
  
  if (view === 'todays') return news.articles;
  if (view === 'all') return news.articles;
  if (view === 'liked') return liked;
  if (view === 'disliked') return disliked;
  if (view === 'readLater') return readLater;
  return news.articles;
} 