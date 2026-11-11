import * as taskService from '../service/task.service.js';

export async function getTasks(req, res, next) {
    try {
        const { from, to } = req.query;
        const tasks = await taskService.getTasks(from, to);

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export async function createTask(req, res, next) {
    try {
        const { title, date, assigneeId } = req.body;
        const task = await taskService.createTask({
            title,
            date,
            assigneeId,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}