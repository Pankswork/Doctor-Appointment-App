import express from 'express';
import { SlotController } from '../controllers/slot.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth(['admin']), SlotController.createSlot);
router.get('/availability', SlotController.getSlotsAvailability);

export const SlotRoutes = router;
