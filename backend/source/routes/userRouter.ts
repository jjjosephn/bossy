import {Router} from 'express';
import { checkUserExists, getCompanyReviewsByUserId, getReviewsByUserId } from '../controllers/userController';

const router = Router();

router.post('/check-user', checkUserExists);
router.get('/get-reviews/:userId', getReviewsByUserId);
router.get('/get-company-reviews/:userId', getCompanyReviewsByUserId); 

export default router;