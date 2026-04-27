import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User";
import { UserProfile } from "./models/UserProfile";
import { Job } from "./models/Job";
import { Application } from "./models/Application";
import { RefreshToken } from "./models/RefreshToken";
import { Comment } from "./models/Comment";

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? { require: true, rejectUnauthorized: false }
        : false,
  },
  models: [User, UserProfile, Job, Application, RefreshToken, Comment],
});

// const isProd = process.env.NODE_ENV === "production";

// export const sequelize = process.env.DATABASE_URL
//   ? new Sequelize(process.env.DATABASE_URL, {
//       dialect: "postgres",
//       models: [User, UserProfile, Job, Application, RefreshToken, Comment],
//       dialectOptions: isProd
//         ? {
//             ssl: {
//               require: true,
//               rejectUnauthorized: false,
//             },
//           }
//         : {},
//     })
//   : new Sequelize({
//       database: process.env.DATABASE_NAME,
//       username: process.env.DATABASE_USERNAME,
//       password: process.env.DATABASE_PASSWORD,
//       host: process.env.DATABASE_HOST,
//       port: Number(process.env.DATABASE_PORT),
//       dialect: "postgres",
//       models: [User, UserProfile, Job, Application, RefreshToken, Comment],
//     });

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

export { User, UserProfile, Job, Application, RefreshToken, Comment };
