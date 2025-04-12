import { Router } from 'express';
import { addBossRequest } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);

export default router;