import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { setupChatSocket } from './sockets/chat.socket.js';
import { loadKnowledge } from './services/knowledge.service.js';

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Load Knowledge Base into memory cache
  await loadKnowledge();

  // 3. Create HTTP Server
  const server = http.createServer(app);

  // 3. Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        return callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // 4. Attach Chat Socket Handlers
  setupChatSocket(io);

  // 5. Start listening
  const PORT = env.port;
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
  });

  // Handle server shutdown or crash
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...', (err as any).message);
    server.close(() => process.exit(1));
  });
};

startServer();
