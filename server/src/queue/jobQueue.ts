import dotenv from 'dotenv';
import Queue from 'bull';
dotenv.config();

export const jobQueue = new Queue('fetch-jobs', {
  redis: { 
    host: '127.0.0.1', port: 6379
   },
});

jobQueue.on('error', (err) => {
  console.error('Redis connection error:', err);
});

jobQueue.on('ready', () => {
  console.log('✅ Connected to Redis at', jobQueue.client.options);
});