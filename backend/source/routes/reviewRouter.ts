import { Router } from 'express';
import { newReview } from '../controllers/reviewController';

const router = Router();

router.post('/new', newReview);

export default router;