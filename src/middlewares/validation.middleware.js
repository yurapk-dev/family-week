import { isCalendarDate, isValidDateRange } from '../utils/dates.js';

export function validateLogin(req, res, next) {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        const error = new Error('Тело запроса должно быть JSON-объектом');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        return next(error);
    }

    const allowedFields = ['login', 'password'];
    const fields = {};

    if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
        fields.body = 'Допустимы только поля login и password';
    }

    if (typeof body.login !== 'string' || !body.login.trim()) {
        fields.login = 'Укажите непустой логин';
    }

    if (typeof body.password !== 'string' || !body.password.length) {
        fields.password = 'Укажите непустой пароль';
    }

    if (Object.keys(fields).length) {
        const error = new Error('Проверьте данные');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        error.fields = fields;
        return next(error);
    }

    req.body.login = body.login.trim().toLowerCase();
    next();
}

export function validateTaskDateRange(req, res, next) {
    const { from, to } = req.query;
    const fields = {};

    if (!isCalendarDate(from)) {
        fields.from = 'Укажите существующую дату в формате YYYY-MM-DD';
    }

    if (!isCalendarDate(to)) {
        fields.to = 'Укажите существующую дату в формате YYYY-MM-DD';
    }

    if (!Object.keys(fields).length && !isValidDateRange(from, to)) {
        fields.to = 'Конец диапазона должен быть не раньше начала; максимум 31 день включительно';
    }

    if (Object.keys(fields).length) {
        const error = new Error('Проверьте параметры дат');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        error.fields = fields;
        return next(error);
    }

    next();
}

export function validateCreateTask(req, res, next) {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        const error = new Error('Тело запроса должно быть JSON-объектом');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        return next(error);
    }

    const allowedFields = ['title', 'date', 'assigneeId'];
    const fields = {};

    if (Object.keys(body).some(field => !allowedFields.includes(field))) {
        fields.body = 'Допустимы только поля title, date и assigneeId';
    }

    if (
        typeof body.title !== 'string'
        || !body.title.trim()
        || body.title.trim().length > 120
    ) {
        fields.title = 'Укажите название от 1 до 120 символов';
    }

    if (!isCalendarDate(body.date)) {
        fields.date = 'Укажите существующую дату в формате YYYY-MM-DD';
    }

    if (
        typeof body.assigneeId !== 'string'
        || !/^[a-fA-F0-9]{24}$/.test(body.assigneeId)
    ) {
        fields.assigneeId = 'Укажите корректный ID участника';
    }

    if (Object.keys(fields).length) {
        const error = new Error('Проверьте данные');
        error.status = 400;
        error.code = 'VALIDATION_ERROR';
        error.fields = fields;
        return next(error);
    }

    req.body.title = body.title.trim();
    next();
}


