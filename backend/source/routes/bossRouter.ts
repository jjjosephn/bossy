import { Router } from 'express';
import { addBossRequest, getBosses, getBossInfo } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);
router.get('/:mapboxId', getBosses);
router.get('/info/:bossId', getBossInfo);


export default router;