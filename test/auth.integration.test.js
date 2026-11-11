import { beforeAll, afterAll, expect, test } from '@jest/globals';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import Member from '../src/models/member.model.js';

let app;
let sessionStore;
let member;
const password = 'test-password-123';

beforeAll(async () => {
    // Check before importing app: its session store opens a database connection.
    if (process.env.NODE_ENV !== 'test'
        || new URL(process.env.MONGODB_URI).pathname !== '/family_week_test') {
        throw new Error('Integration tests require NODE_ENV=test and family_week_test');
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    ({ default: app } = await import('../src/app.js'));
    ({ sessionStore } = await import('../src/middlewares/session.middleware.js'));

    member = await Member.create({
        name: 'Test planner',
        login: `test-${new mongoose.Types.ObjectId()}`,
        passwordHash: await bcrypt.hash(password, 12),
        role: 'planner',
    });
});

afterAll(async () => {
    try {
        if (member) {
            await mongoose.connection.collection('sessions').deleteMany({
                session: { $regex: member.id },
            });
            await Member.deleteOne({ _id: member._id });
        }
    } finally {
        try {
            if (sessionStore) await sessionStore.close();
        } finally {
            await mongoose.disconnect();
        }
    }
});

test('login sets a session cookie and /auth/me recognizes the participant', async () => {
    const agent = request.agent(app);
    const expectedMember = { id: member.id, name: member.name, role: member.role };

    const login = await agent.post('/api/v1/auth/login')
        .send({ login: member.login, password })
        .expect(200);

    expect(login.body).toEqual(expectedMember);
    expect(login.headers['set-cookie']).toEqual(expect.arrayContaining([
        expect.stringMatching(/^connect\.sid=.*HttpOnly.*SameSite=Lax/),
    ]));

    const currentMember = await agent.get('/api/v1/auth/me').expect(200);
    expect(currentMember.body).toEqual(expectedMember);
});

test('protected routes reject requests without a session', async () => {
    for (const path of ['/api/v1/auth/me', '/api/v1/members']) {
        const response = await request(app).get(path).expect(401);
        expect(response.body.error.code).toBe('UNAUTHENTICATED');
    }
});

test('planner access follows the current role in the database', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({ login: member.login, password }).expect(200);
    await agent.get('/api/v1/members').expect(200);

    try {
        await Member.updateOne({ _id: member._id }, { role: 'member' });
        const me = await agent.get('/api/v1/auth/me').expect(200);
        expect(me.body.role).toBe('member');
        const response = await agent.get('/api/v1/members').expect(403);
        expect(response.body.error.code).toBe('FORBIDDEN');
    } finally {
        await Member.updateOne({ _id: member._id }, { role: 'planner' });
    }
});

test('protected routes reject a session belonging to a deleted participant', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({ login: member.login, password }).expect(200);
    const original = await Member.findById(member._id).select('+passwordHash').lean();

    try {
        await Member.deleteOne({ _id: member._id });
        for (const path of ['/api/v1/auth/me', '/api/v1/members']) {
            const response = await agent.get(path).expect(401);
            expect(response.body.error.code).toBe('UNAUTHENTICATED');
        }
    } finally {
        await Member.create(original);
    }
});

test.each(['wrong password', 'unknown login'])(
    'login rejects %s without creating an authenticated session',
    async (scenario) => {
        const agent = request.agent(app);
        const credentials = scenario === 'wrong password'
            ? { login: member.login, password: 'incorrect-password' }
            : { login: `unknown-${member.id}`, password };

        const response = await agent.post('/api/v1/auth/login')
            .send(credentials)
            .expect(401);

        expect(response.body).toEqual({
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Неверный логин или пароль',
            },
        });
        expect(response.headers['set-cookie']).toBeUndefined();

        const currentMember = await agent.get('/api/v1/auth/me').expect(401);
        expect(currentMember.body.error.code).toBe('UNAUTHENTICATED');
    },
);
