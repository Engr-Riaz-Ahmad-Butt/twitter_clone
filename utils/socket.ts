import { Server as SocketIOServer } from "socket.io";
import http from "http";

let io: SocketIOServer | null = null;

export function getSocketIO() {
  if (!io) {
    const server = http.createServer();
    io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    server.listen(3001, () => {
      console.log("Socket.io server initialized on port 3001");
    });
  }
  return io;
}
