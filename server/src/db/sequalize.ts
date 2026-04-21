
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { UserProfile } from './models/UserProfile';
import { Job } from './models/Job';
import { Application } from './models/Application';
import { RefreshToken } from './models/RefreshToken';
import { Comment } from './models/Comment';

export const sequelize = new Sequelize({
  database: 'appHub',
  username: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  models: [User, UserProfile, Job, Application, RefreshToken, Comment],
});

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};

export { User, UserProfile, Job, Application, RefreshToken, Comment };
