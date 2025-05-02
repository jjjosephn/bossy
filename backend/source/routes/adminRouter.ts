import { Router } from 'express';
import { acceptBossRequest, declineBossRequest, getArchivedForms, getPendingBosses, getAllPendingBossReviews, acceptPendingBossReview, declinePendingBossReview } from '../controllers/adminController';

const router = Router();

router.get('/pending-bosses', getPendingBosses);
router.post('/accept-boss-request', acceptBossRequest);
router.post('/decline-boss-request', declineBossRequest);
router.get('/archived-bosses', getArchivedForms)
router.get('/pending-boss-reviews', getAllPendingBossReviews)
router.post('/accept-pending-boss-review', acceptPendingBossReview)
router.post('/decline-pending-boss-review', declinePendingBossReview)

export default router;