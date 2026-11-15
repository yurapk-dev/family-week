import * as taskRepository from '../repositories/task.repository.js';
import * as memberRepository from '../repositories/member.repository.js';

export async function getTasks(from, to) {
    const tasks = await taskRepository.findTasksByDateRange(from, to);

    return tasks.map(task => task.toJSON());
}

export async function createTask({title, date, assigneeId}) {
    const member = await memberRepository.findById(assigneeId);

    if (!member) {
        const error = new Error('Проверьте данные');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        error.fields = {
            assigneeId: 'Участник не найден',
        };
        throw error;
    }

    const task = await taskRepository.createTask({
        title,
        date,
        assigneeId,
    });

    return task.toJSON();
}

export async function updateTask(id, {title, date, assigneeId}) {
    const task = await taskRepository.findById(id);
    if (!task) {
        const error = new Error('Дело не найдено');
        error.status = 404;
        error.code = 'TASK_NOT_FOUND';
        throw error;
    }
    const changes = {};
    if (title !== undefined) changes.title = title;
    if (date !== undefined) changes.date = date;
    if (assigneeId !== undefined) {
        const member = await memberRepository.findById(assigneeId);
        if (!member) {
            const error = new Error('Проверьте данные');
            error.status = 400;
            error.code = 'VALIDATION_ERROR';
            error.fields = {
                assigneeId: 'Участник не найден',
            };
            throw error;
        }
        changes.assigneeId = assigneeId;
        if (task.assigneeId.toString() !== member.id) changes.done = false;
    }

    const updatedTask = await taskRepository.updateById(id, changes);

    if (!updatedTask) {
        const error = new Error('Дело не найдено');
        error.status = 404;
        error.code = 'TASK_NOT_FOUND';
        throw error;
    }

    return updatedTask.toJSON();
}

export async function deleteTask(id) {
    const task = await taskRepository.deleteById(id);
    if (!task) {
        const error = new Error('Дело не найдено');
        error.status = 404;
        error.code = 'TASK_NOT_FOUND';
        throw error;
    }
}