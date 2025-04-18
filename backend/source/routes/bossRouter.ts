import { Router } from 'express';
import { addBossRequest, getBosses } from '../controllers/bossController';

const router = Router();

router.post('/add-boss-request', addBossRequest);
router.get('/:mapboxId', getBosses);


export default router;