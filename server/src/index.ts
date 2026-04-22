import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initDb } from "./db/sequalize";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/auth.router";
import { profileRouter } from "./routers/profile.router";
import { jobsRouter } from "./routers/jobs.router";
import { applicationsRouter } from "./routers/applications.router";
import { commentRouter } from "./routers/comments.router";

const PORT = 5000;

async function bootstrap() {
  try {
    await initDb();

    const app = express();

    app.use(
      cors({
        origin: ["https://app-hub-wheat.vercel.app"],
        credentials: true,
      }),
    );
    app.use(cookieParser());
    app.use(express.json());

    app.get("/api", (req, res) => {
      res.json({ message: "Hello from server!" });
    });

    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
    app.use("/jobs", jobsRouter);
    app.use("/applications", applicationsRouter);
    app.use("/comments", commentRouter);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup error", error);
    process.exit(1);
  }
}

bootstrap();
