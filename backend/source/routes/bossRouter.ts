import { Router } from 'express';
import { acceptBossRequest, addBossRequest, declineBossRequest, getArchivedForms, getPendingBosses } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);
router.get('/pending-bosses', getPendingBosses);
router.post('/accept-boss-request', acceptBossRequest);
router.post('/decline-boss-request', declineBossRequest);
router.get('/archived-bosses', getArchivedForms)

export default router;