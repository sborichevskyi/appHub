import dotenv from 'dotenv';
import Queue from 'bull';
dotenv.config();

export const jobQueue = new Queue('fetch-jobs', {
  redis: { 
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
   },
});

jobQueue.on('error', (err) => {
  console.error('Redis connection error:', err);
});

jobQueue.on('ready', () => {
  console.log('✅ Connected to Redis at', jobQueue.client.options);
});