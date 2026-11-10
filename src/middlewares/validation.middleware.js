
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


