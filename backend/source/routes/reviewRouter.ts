import { Router } from 'express';
import { getBossReviews, newBossReview, newCompanyReview } from '../controllers/reviewController';

const router = Router();

router.post('/newbossreview', newBossReview);
router.get('/boss/:bossId', getBossReviews);
router.post('/newcompanyreview', newCompanyReview);

export default router;