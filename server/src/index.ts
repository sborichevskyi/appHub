import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { initDb } from './db/sequalize';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { userRouter } from './routers/user.router';
import { authRouter } from './routers/auth.router';
import { profileRouter } from './routers/profile.router';
import { jobsRouter } from './routers/jobs.router';
import { applicationsRouter } from './routers/applications.router';
import { commentRouter } from './routers/comments.router';

const PORT = 5000;

async function bootstrap() {
  try {
    await initDb();

    const app = express();

    app.use(cookieParser());
    app.use(express.json());

    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
      }),
    );

    // 1️⃣ React build
    // app.use(express.static(path.join(__dirname, 'client_build')));

    // 2️⃣ API
    app.get('/api', (req, res) => {
      res.json({ message: 'Hello from server!' });
    });

    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/profile', profileRouter);
    app.use('/jobs', jobsRouter);
    app.use('/applications', applicationsRouter);
    app.use('/comments', commentRouter);

    // 3️⃣ React BrowserRouter
    // app.use((req, res) => {
    //   res.sendFile(path.join(__dirname, 'client_build', 'index.html'));
    // });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup error', error);
    process.exit(1);
  }
}

bootstrap();