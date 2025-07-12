import express from 'express';
import { newsController } from '../controllers/newsController.js';

const router = express.Router();

router.get('/', newsController.getTodaysNews);
router.post('/like/:id', newsController.likeArticle);
router.post('/dislike/:id', newsController.dislikeArticle);
router.post('/readLater/:id', newsController.readLater);

export default router;