CREATE TABLE IF NOT EXISTS articles (
    if SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    first_paragraph TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    read_later INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);