import { Router } from 'express';
import { acceptBossRequest, declineBossRequest, getArchivedForms, getPendingBosses } from '../controllers/adminController';

const router = Router();

router.get('/pending-bosses', getPendingBosses);
router.post('/accept-boss-request', acceptBossRequest);
router.post('/decline-boss-request', declineBossRequest);
router.get('/archived-bosses', getArchivedForms)

export default router;