const pool = require('../config/database');

class Article {
    //create
    static async create(title, description, content, LINK, author) {
        const { rows } = await pool.query(
            'Insert INTO articles (title, description, content, LINK, author) VALUES ($1, $2, $3, $3, NOW()) RETURNING *',
            [title, description, content, LINK, author]
        );
        return rows[0];
    }
    //findbydate
    // should check the format to ISO. Add a verifier (in dateUtils?)
    static async findByDate(date) {
        const { rows } = await pool.query(
            'SELECT * FROM articles WHERE DATE(created_at) = $1 ORDER BY created_at DESC',
            [date]
        );
        return rows;
    }

    //findall
    static async findAll() {
        const { rows } = await pool.query (
            'SELECT * FROM articles ORDER BY created_at desc'
        );
        return rows;
    }
    //findbyId - need to implement in db itself
    static async findById(id) {
        const { rows } = await pool.query (
            'SELECT * from articles WHERE id = $1',
            [id]
        );
        return rows[0];
    }

    //increment likes
    static async incrementLikes(id) {
        const { rows } = await pool.query(
            'UPDATE articles SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
    }
    //incremental dislike
    static async incrementDislikes(id) {
        const { rows } = await pool.query(
            'UPDATE articles SET dislikes = dislikes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
    }
    // read later
    static async setReadLater(id) {
        const { rows } = await pool.query(
            'UPDATE articles SET read_later = true WHERE id = $1 RETURNING *',
            [id]
        );
    }
}

module.exports = { Article };