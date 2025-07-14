import pool from '../config/database.js';

// Eventually replace with toast notifications so user can see this

export class Article {
    static async create(title, description, author, source, url, content, published_at) {
        try {
            const { rows } = await pool.query(
            'INSERT INTO articles (title, description, author, source, url, content, published_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) ON CONFLICT (url) DO NOTHING RETURNING *',
            [title, description, author, source, url, content, published_at]
        );
        return rows[0];
        } catch (err) {
            console.log("Creation error: ", err);
        }
            
    }
    //findbydate
    // should check the format to ISO. Add a verifier (in dateUtils?)
    static async findByDate(date) {
        try {
            const { rows } = await pool.query(
            'SELECT * FROM articles WHERE DATE(created_at) = $1 ORDER BY created_at DESC',
            [date]
        );
        return rows;
        } catch (err) {
            console.log("Couldn't find article by date: ", err);
            return [];
        }
        
    }

    //findall
    static async findAll() {
        try {
            const { rows } = await pool.query (
            'SELECT * FROM articles ORDER BY created_at desc'
        );
        return rows;
        } catch (err) {
            console.log("No articles found. Did you delete the database? ", err);
        }
    }
    //findbyId - need to implement in db itself
    static async findById(id) {
        try {
            const { rows } = await pool.query (
            'SELECT * from articles WHERE id = $1',
            [id]
        );
        return rows[0];
        } catch (err) {
        console.log("Couldn't find article by Id: ", err);
        }
    }

    //increment likes
    static async incrementLikes(id) {
        try {
            const { rows } = await pool.query(
            'UPDATE articles SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
            return rows[0];
        } catch (err) {
            console.log("Couldn't increment likes: ", err);
        }
    }
    //incremental dislike
    static async incrementDislikes(id) {
        try {
            const { rows } = await pool.query(
            'UPDATE articles SET dislikes = dislikes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
            return rows[0];
        } catch (err) {
            console.log("Couldn't decrement dislikes: ", err);
        }
    }
    // read later
    static async setReadLater(id) {
        try {
            const { rows } = await pool.query(
            'UPDATE articles SET read_later = true WHERE id = $1 RETURNING *',
            [id]
        );
            return rows[0];
        } catch (err) {
            console.log("Couldn't set this article to read later: ", err);
        }
    }
}