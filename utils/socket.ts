import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

let io: SocketIOServer | null = null;

export function getSocketIO() {
  if (!io) {
    const server = createServer();

    io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
      },
    });

    server.listen(3001, () => {
      console.log("✅ WebSocket server running on ws://localhost:3001");
    });
  }

  return io;
}
