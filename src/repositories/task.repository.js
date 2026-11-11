import Task from '../models/task.model.js';

export async function findTasksByDateRange(from, to) {
    return Task.find({
        date: {
            $gte: from,
            $lte: to,
        },
    })
        .sort({ date: 1, _id: 1 }).exec();
}
export async function createTask({ title, date, assigneeId }) {
    return Task.create({
        title,
        date,
        assigneeId,
    });
}