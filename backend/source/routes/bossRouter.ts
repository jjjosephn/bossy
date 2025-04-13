import { Router } from 'express';
import { acceptBossRequest, addBossRequest, declineBossRequest, getPendingBosses } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);
router.get('/pending-bosses', getPendingBosses);
router.post('/accept-boss-request', acceptBossRequest);
router.post('/decline-boss-request', declineBossRequest);

export default router;