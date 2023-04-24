import { Router } from 'express';
import AddWatermark from '../../controllers/addWatermark';

const router = Router();

router.post('/add-watermark', AddWatermark.addWatermark);

export default router;