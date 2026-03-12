import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/stats', auth(['admin']), AdminController.getStats);

export const AdminRoutes = router;
