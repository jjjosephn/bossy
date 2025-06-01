import { Router } from 'express';
import { 
   acceptBossRequest, 
   declineBossRequest, 
   getArchivedForms, 
   getPendingBosses, 
   getAllPendingBossReviews, 
   acceptPendingBossReview, 
   declinePendingBossReview, 
   getArchivedBossReviews, 
   getPendingCompanyReviews, 
   acceptPendingCompanyReview,
   declinePendingCompanyReview,
   getArchivedCompanyReviews,
   newFeedback,
   getFeedbacks,
   acknowledgeFeedback
} from '../controllers/adminController';

const router = Router();

router.get('/pending-bosses', getPendingBosses);
router.post('/accept-boss-request', acceptBossRequest);
router.post('/decline-boss-request', declineBossRequest);
router.get('/archived-bosses', getArchivedForms)
router.get('/pending-boss-reviews', getAllPendingBossReviews)
router.post('/accept-pending-boss-review', acceptPendingBossReview)
router.post('/decline-pending-boss-review', declinePendingBossReview)
router.get('/archived-boss-reviews', getArchivedBossReviews)
router.get('/pending-company-reviews', getPendingCompanyReviews);
router.post('/accept-pending-company-review', acceptPendingCompanyReview);
router.post('/decline-pending-company-review', declinePendingCompanyReview);
router.get('/archived-company-reviews', getArchivedCompanyReviews);
router.post('/new-feedback', newFeedback);
router.get('/feedbacks', getFeedbacks)
router.delete('/acknowledge-feedback/:feedbackId', acknowledgeFeedback)

export default router;