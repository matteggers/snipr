import React from 'react';
import { SectionTitle } from '../components/SectionTitle.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { useArticles } from '../hooks/useArticles.js';

function LikedPage() {
  const { articles, loading, error } = useArticles();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter articles that are liked
  const likedArticles = articles.filter(article => {
    const actions = JSON.parse(localStorage.getItem(`article-actions-${article.id}`) || '{}');
    return actions.like;
  });

  return (
        <div>
          <SectionTitle name="Liked" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {likedArticles.map((article, index) => (
          <ArticleCard
            key={article.id || index}
            id={article.id}
            title={article.title}
            description={article.description}
          />
        ))}
      </div>
        </div>
  );
}

export default LikedPage;