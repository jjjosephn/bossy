import { Router } from 'express';
import { getBossReviews, newBossReview, newCompanyReview, getCompanyReviews } from '../controllers/reviewController';

const router = Router();

router.post('/newbossreview', newBossReview);
router.get('/boss/:bossId', getBossReviews);
router.post('/newcompanyreview', newCompanyReview);
router.get('/company/:mapboxId', getCompanyReviews); 

export default router;