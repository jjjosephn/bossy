import { Router } from 'express';
import { getBossReviews, newBossReview } from '../controllers/reviewController';

const router = Router();

router.post('/new', newBossReview);
router.get('/boss/:bossId', getBossReviews);

export default router;