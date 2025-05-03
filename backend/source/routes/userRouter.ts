import {Router} from 'express';
import { checkUserExists, getReviewsByUserId } from '../controllers/userController';

const router = Router();

router.post('/check-user', checkUserExists);
router.get('/get-reviews/:userId', getReviewsByUserId);

export default router;