import app from './app.js';
import { connectDB } from '../configuration/db.js';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started: ${BASE_URL}`);
    });
} catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
}
