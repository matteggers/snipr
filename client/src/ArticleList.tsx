import * as React from 'react';

type Article = {
  title: string;
  description: string;
};

type ArticleListProps = {
  articles: Article[];
  liked: Article[];
  disliked: Article[];
  readLater: Article[];
  onLike: (article: Article) => void;
  onDislike: (article: Article) => void;
  onReadLater: (article: Article) => void;
};

const ArticleList: React.FC<ArticleListProps> = ({ articles, liked, disliked, readLater, onLike, onDislike, onReadLater }) => (
  <div>
    {articles.length === 0 ? (
      <div>No articles to show.</div>
    ) : (
      articles.map((article, idx) => (
        <div key={idx} className="article-card">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <div className="article-actions">
            <button onClick={() => onLike(article)} disabled={!!liked.find(a => a.title === article.title)}>
              {liked.find(a => a.title === article.title) ? 'Liked' : 'Like'}
            </button>
            <button onClick={() => onDislike(article)} disabled={!!disliked.find(a => a.title === article.title)}>
              {disliked.find(a => a.title === article.title) ? 'Disliked' : 'Dislike'}
            </button>
            <button onClick={() => onReadLater(article)} disabled={!!readLater.find(a => a.title === article.title)}>
              {readLater.find(a => a.title === article.title) ? 'Saved' : 'Read Later'}
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default ArticleList; 