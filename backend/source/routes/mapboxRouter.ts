import { Router } from 'express';
import { fetchCustomSearchMapboxData, fetchMapboxUtilsData, fetchSearchComponentMapboxData } from '../controllers/mapboxController';

const router = Router();

router.get('/fetch-search-component-mapbox-data', fetchSearchComponentMapboxData);
router.get('/fetch-custom-search-mapbox-data', fetchCustomSearchMapboxData);
router.get('/fetch-mapbox-utils-data', fetchMapboxUtilsData);

export default router;