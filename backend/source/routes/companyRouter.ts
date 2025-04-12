import { Router } from 'express';
import { checkCompanyExists, getCompanyByMapboxId } from '../controllers/companyController';

const router = Router();

router.post('/check-company', checkCompanyExists);
router.get('/:mapboxId', getCompanyByMapboxId);

export default router;