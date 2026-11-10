import * as authService from '../service/auth.service.js';

export async function login(req, res, next) {
    try {
        const member = await authService.login(req.body.login, req.body.password);
        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => error ? reject(error) : resolve());
        });
        req.session.memberId = member.id;
        await new Promise((resolve, reject) => {
            req.session.save((error) => error ? reject(error) : resolve());
        });
        return res.status(200).json({id: member.id, name: member.name, role: member.role});
    } catch (error) {
        next(error);
    }
}

export async function getMe(req, res, next) {
    try {
        const member = await authService.getCurrentMember(req.session.memberId);

        return res.status(200).json({id: member.id, name: member.name, role: member.role});
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const cookieOptions = {
            path: req.session?.cookie.path ?? '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: req.session?.cookie.secure ?? (process.env.NODE_ENV === 'production'),
        };

        if (req.session?.cookie.domain) {
            cookieOptions.domain = req.session.cookie.domain;
        }

        if (req.session) {
            await new Promise((resolve, reject) => {
                req.session.destroy((error) => error ? reject(error) : resolve());
            });
        }

        res.clearCookie(process.env.SESSION_COOKIE_NAME || 'connect.sid', cookieOptions);
        return res.status(204).end();
    } catch (error) {
        next(error);
    }
}
