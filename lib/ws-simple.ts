import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './db';
import jwt from 'jsonwebtoken';

export function initWebSocketServer(server: any) {
  const io = new SocketIOServer(server, {
    path: '/ws',
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
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
    
    socket.on('agent:register', async (data) => {
      await prisma.agent.updateMany({
        where: { agentId: data.agentId },
        data: { status: 'online', lastSeenAt: new Date() }
      });
      io.emit('agent:connected', { agentId: data.agentId });
    });

    socket.on('disconnect', async () => {
      await prisma.agent.updateMany({
        where: { agentId: socket.data.agentId },
        data: { status: 'offline' }
      });
    });
  });

  return io;
}
