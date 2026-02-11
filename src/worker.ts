import { Worker } from 'bullmq';
import { redis } from '../lib/redis';

const taskWorker = new Worker(
  'agent-tasks',
  async (job) => {
    console.log(`Processing task ${job.id}: ${job.name}`);
    // Task processing logic here
    console.log('Job data:', job.data);
    return { success: true };
  },
  { connection: redis }
);

console.log('Worker started');

taskWorker.on('completed', (job) => {
  console.log(`Task ${job.id} completed`);
});

taskWorker.on('failed', (job, err) => {
  console.error(`Task ${job?.id} failed:`, err);
});

// Keep the process running
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await taskWorker.close();
  process.exit(0);
});
