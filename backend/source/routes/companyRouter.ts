import { Router } from 'express';
import { checkCompanyExists } from '../controllers/companyController';

const router = Router();

router.post('/check-company', checkCompanyExists);

export default router;