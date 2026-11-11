export function requirePlanner(req, res, next) {
    if (!req.user) {
        const error = new Error('Необходимо войти в систему');
        error.status = 401;
        error.code = 'UNAUTHENTICATED';
        return next(error);
    }

    if (req.user.role !== 'planner') {
        const error = new Error('Недостаточно прав');
        error.status = 403;
        error.code = 'FORBIDDEN';
        return next(error);
    }

    return next();
}
