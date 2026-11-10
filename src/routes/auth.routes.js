import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateLogin } from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

export default router;
