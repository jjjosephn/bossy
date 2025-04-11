import {Router} from 'express';
import { checkUserExists } from '../controllers/userController';

const router = Router();

router.post('/check-user', checkUserExists);

export default router;