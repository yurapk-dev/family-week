import {Router} from 'express';
import {authenticate} from '../middlewares/auth.middleware.js';
import {requirePlanner} from '../middlewares/authorization.middleware.js';
import {validateTaskDateRange, validateCreateTask, validateUpdateTask, validateTaskId} from '../middlewares/validation.middleware.js';
import {getTasks, createTask, updateTask, deleteTask} from '../controllers/task.controller.js';


const router = Router();

router.get('/', authenticate, requirePlanner, validateTaskDateRange, getTasks);
router.post('/', authenticate, requirePlanner, validateCreateTask, createTask);
router.patch('/:id', authenticate, requirePlanner, validateUpdateTask, updateTask);
router.delete('/:id', authenticate, requirePlanner, validateTaskId, deleteTask);

export default router;