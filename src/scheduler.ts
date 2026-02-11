import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

const agentTaskQueue = new Queue('agent-tasks', { connection: redis });

async function scheduleTasks() {
  console.log('Scheduler running...');
  // Add any scheduled tasks here
}

// Run immediately
scheduleTasks();

// Run every minute
setInterval(scheduleTasks, 60000);

process.on('SIGINT', async () => {
  console.log('Shutting down scheduler...');
  await agentTaskQueue.close();
  process.exit(0);
});
