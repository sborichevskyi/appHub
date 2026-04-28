import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initDb } from "./db/sequalize";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/auth.router";
import { profileRouter } from "./routers/profile.router";
import { jobsRouter } from "./routers/jobs.router";
import { applicationsRouter } from "./routers/applications.router";
import { commentRouter } from "./routers/comments.router";

const allowedOrigins = [
  "http://localhost:5173",
  "https://app-hub-wheat.vercel.app",
];

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  try {
    const app = express();
    console.log("RAW PORT =", process.env.PORT);
    console.log("FINAL PORT =", PORT);

    // ⬇️ Ініціалізація БД ПЕРША (ДО того як сервер слухає)
    await initDb();

    app.use((req, res, next) => {
      console.log("HIT:", req.method, req.url);
      next();
    });

    app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
      }),
    );

    app.use(cookieParser());
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("OK");
    });

    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
    app.use("/jobs", jobsRouter);
    app.use("/applications", applicationsRouter);
    app.use("/comments", commentRouter);

    // ⬇️ listen ОСТАННІМ (після всіх middleware та роутів)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup error", error);
    process.exit(1);
  }
}

bootstrap();
