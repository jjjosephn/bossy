import { Router } from 'express';
import { addBossRequest, getPendingBosses } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);
router.get('/pending-bosses', getPendingBosses);

export default router;