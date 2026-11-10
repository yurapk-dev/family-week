import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import { sessionMiddleware } from './middlewares/session.middleware.js';
const app = express();
app.use(express.json());


app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use(sessionMiddleware);
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

export default app;
