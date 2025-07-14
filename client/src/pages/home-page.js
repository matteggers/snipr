import React from 'react';
import { SectionTitle } from '../components/SectionTitle.js';
import { useArticles } from '../hooks/useArticles.js'; 
import { ArticleCard } from '../components/ArticleCard.js';

function HomePage() {
  const { articles, loading, error } = useArticles();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <SectionTitle name="Home" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id || index}
            id={article.id}
            title={article.title}
            description={article.description}
            likes={article.likes}
            dislikes={article.dislikes}
            read_later={article.read_later}
            />
        ))}
      </div>
    </div>
  );
}


export default HomePage;