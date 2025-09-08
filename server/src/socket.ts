import { Server } from "socket.io";
import http from "http";
import { Express } from "express";

let io: Server; 
export const initSocket = (app: Express) => {
  // Create HTTP server from express app
  const server = http.createServer(app);

  // Initialize Socket.IO
io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log(`\nUser connected: ${socket.id}`);

    socket.on("message", (data) => {
      console.log(`Received: ${data}`);
      // Broadcast to all connected clients
      io.emit("message", data);
    });

    socket.on("joinClass", (classRoomId: string) => {
      socket.join(classRoomId);
      console.log(`\n\n\nUser ${socket.id} joined class ${classRoomId}\n\n\n`);
    });

    // When a user leaves a class room
    socket.on("leaveClass", (classRoomId: string) => {
      socket.leave(classRoomId);
      console.log(`User ${socket.id} left class ${classRoomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return server;
};


// Getter for io instance
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io has not been initialized! Call initSocket(app) first.");
  }
  return io;
};