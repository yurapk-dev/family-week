import * as taskRepository from '../repositories/task.repository.js';
import * as memberRepository from '../repositories/member.repository.js';

export async function getTasks(from, to) {
    const tasks = await taskRepository.findTasksByDateRange(from, to);

    return tasks.map(task => task.toJSON());
}
export async function createTask({ title, date, assigneeId }) {
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
