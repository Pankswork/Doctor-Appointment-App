import express from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/', auth(['admin']), UserController.getAllUsers);
router.patch('/:id', auth(['patient', 'admin']), UserController.updateUser);

export const UserRoutes = router;
