import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    },
  });

  io.on('connection', socket => {
    // Client joins room channel for real-time schedule updates
    socket.on('join_room', (roomId: string) => {
      if (roomId && typeof roomId === 'string') {
        socket.join(`room:${roomId}`);
      }
    });

    socket.on('leave_room', (roomId: string) => {
      if (roomId && typeof roomId === 'string') {
        socket.leave(`room:${roomId}`);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
};

export const notifyAvailabilityChanged = (roomId: string, date?: string) => {
  if (io) {
    io.to(`room:${roomId}`).emit('availability:changed', {
      roomId,
      date,
      timestamp: new Date().toISOString(),
    });
  }
};
