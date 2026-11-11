import {Router} from 'express';
import {authenticate} from '../middlewares/auth.middleware.js';
import {requirePlanner} from '../middlewares/authorization.middleware.js';
import {validateTaskDateRange, validateCreateTask} from '../middlewares/validation.middleware.js';
import {getTasks, createTask} from '../controllers/task.controller.js';



const router = Router();

router.get('/', authenticate, requirePlanner, validateTaskDateRange, getTasks);
router.post('/', authenticate, requirePlanner, validateCreateTask, createTask);

export default router;