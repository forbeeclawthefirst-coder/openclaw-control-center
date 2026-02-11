import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '@/lib/redis';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export function initWebSocketServer(server: any) {
  const io = new SocketIOServer(server, {
    path: '/ws',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Use Redis adapter for scaling across multiple instances
  io.adapter(createAdapter(pubClient, subClient));

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.AGENT_TOKEN_SECRET!) as any;
      socket.data.agentId = decoded.agentId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Agent connected: ${socket.data.agentId}`);

    // Handle agent registration
    socket.on('agent:register', async (data) => {
      const { agentId, name, capabilities, version } = data;
      
      // Update agent status in database
      await prisma.agent.update({
        where: { agentId },
        data: {
          status: 'online',
          lastSeenAt: new Date(),
          capabilities,
          version,
        },
      });

      // Join room for this agent
      socket.join(`agent:${agentId}`);
      
      // Broadcast to control center
      io.to('control-center').emit('agent:connected', { agentId, name });
    });

    // Handle heartbeats
    socket.on('agent:heartbeat', async (data) => {
      await prisma.agent.update({
        where: { agentId: socket.data.agentId },
        data: {
          lastSeenAt: new Date(),
          metadata: data,
        },
      });
    });

    // Handle task progress
    socket.on('agent:task:progress', async (data) => {
      const { taskId, progress, message } = data;
      
      await prisma.task.update({
        where: { id: taskId },
        data: {
          progress,
          progressMessage: message,
        },
      });

      io.to('control-center').emit('task:progress', { taskId, progress, message });
    });

    // Handle task completion
    socket.on('agent:task:complete', async (data) => {
      const { taskId, result, logs } = data;
      
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: 'completed',
          result,
          completedAt: new Date(),
        },
      });

      // Store logs
      if (logs?.length) {
        await prisma.taskLog.createMany({
          data: logs.map((log: string) => ({
            taskId,
            level: 'info',
            message: log,
          })),
        });
      }

      io.to('control-center').emit('task:completed', { taskId, result });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`Agent disconnected: ${socket.data.agentId}`);
      
      await prisma.agent.update({
        where: { agentId: socket.data.agentId },
        data: {
          status: 'offline',
        },
      });

      io.to('control-center').emit('agent:disconnected', { 
        agentId: socket.data.agentId 
      });
    });
  });

  return io;
}
