export function authenticate(req, res, next) {
    if (!req.session?.memberId) {
        const error = new Error('Необходимо войти в систему');
        error.status = 401;
        error.code = 'UNAUTHENTICATED';
        return next(error);
    }

    next();
}