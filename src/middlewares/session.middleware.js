import session from 'express-session';
import MongoStore from 'connect-mongo';

if (!process.env.SESSION_SECRET) {
    throw new Error('Не задан SESSION_SECRET');
}

export const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
});

export const sessionMiddleware = session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: sessionStore,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
});
