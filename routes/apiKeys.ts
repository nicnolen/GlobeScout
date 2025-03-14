import { Router } from 'express';
import { getGoogleMapsApiKey } from '../library/apiKeys';

const router = Router();

router.get('/google-maps-key', getGoogleMapsApiKey);

export default router;
