export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    // Ошибка разбора JSON в express.json()
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Некорректный JSON',
            },
        });
    }

    const status = Number.isInteger(error.status) && error.status >= 400 && error.status <= 599
        ? error.status
        : 500;

    const body = {
        code: status >= 500 ? 'INTERNAL_ERROR' : error.code || 'REQUEST_ERROR',
        message: status >= 500 ? 'Внутренняя ошибка сервера' : error.message || 'Не удалось выполнить запрос',
    };

    if (status < 500 && error.fields) {
        body.fields = error.fields;
    }

    return res.status(status).json({error: body});
}
