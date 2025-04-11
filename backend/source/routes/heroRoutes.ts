import { Router } from 'express';
import { checkCompanyExists } from '../controllers/heroController';

const router = Router();

router.post('/check-company', checkCompanyExists);

export default router;