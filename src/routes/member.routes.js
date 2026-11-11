import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePlanner } from '../middlewares/authorization.middleware.js';
import { getMembers } from '../controllers/member.controller.js';

const router = Router();

router.get('/', authenticate, requirePlanner, getMembers);

export default router;
