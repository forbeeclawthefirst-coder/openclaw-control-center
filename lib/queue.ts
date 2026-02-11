import { Queue } from 'bullmq';
import { redis } from './redis';

export const agentTaskQueue = new Queue('agent-tasks', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});
