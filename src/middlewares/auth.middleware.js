import { getCurrentMember } from '../service/auth.service.js';

export async function authenticate(req, res, next) {
    try {
        if (!req.session?.memberId) {
            const error = new Error('Необходимо войти в систему');
            error.status = 401;
            error.code = 'UNAUTHENTICATED';
            throw error;
        }

        req.user = await getCurrentMember(req.session.memberId);
        return next();
    } catch (error) {
        return next(error);
    }
}
