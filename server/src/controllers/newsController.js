// Controllers handle actually talking to the users frontend, while services do the actual work. 
// ^ I believe
// So think of controllers as the bank teller, and services as the actual banker.
import { fetchAndSaveNews } from './services/newsService.js';
import { Article } from "../services/databaseService";

const newsController = {
    async getTodaysNews(req, res) {
        // get news
        try {
            const result = await fetchAndSaveNews();
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(404).json({ success: false, message: 'No news found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },


    async likeArticle(req, res) {
        try {
            const articleId = req.params.id;
            const result = await Article.incrementLikes(articleId);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Article not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }

    },

    async dislikeArticle(req, res) {
        try {
            const articleId = req.params.id;
            const result = await Article.incrementDislikes(articleId);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Article not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }

    },

    async readLater(req, res) {
        try {
            const articleId = req.params.id;
            const result = await Article.readLater(articleId);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Article not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }

    }
}
