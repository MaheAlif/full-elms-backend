import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "../chat/chat.js";
import { pool } from "./db";
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/chat", chatRoutes);

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", methods: ["GET", "POST"] },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", async ({ roomId, userId }) => {
    if (!roomId) return;
    socket.join(String(roomId));
    // optionally emit join info
    io.to(String(roomId)).emit("userJoined", { userId, socketId: socket.id });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    if (!roomId) return;
    socket.leave(String(roomId));
  });

  socket.on("sendMessage", async (payload) => {
    // payload: { roomId, senderId, message }
    const { roomId, senderId, message } = payload;
    if (!roomId || !senderId || !message) return;

    // persist to DB
    const conn = await pool.getConnection();
    try {
      const [r] = await conn.query(
        "INSERT INTO chat_messages (room_id, sender_id, message) VALUES (?, ?, ?)",
        [roomId, senderId, message]
      );
      const insertId = (r as any).insertId;
      const [rows] = await conn.query(
        `SELECT cm.id, cm.room_id, cm.sender_id, u.name as sender_name, cm.message, cm.timestamp
         FROM chat_messages cm
         JOIN users u ON u.id = cm.sender_id
         WHERE cm.id = ?`,
        [insertId]
      );
      const saved = (rows as any[])[0];
      io.to(String(roomId)).emit("message", saved);
    } catch (err) {
      console.error("persist message error", err);
    } finally {
      conn.release();
    }
  });

  socket.on("disconnect", () => {
    // handle presence if needed
  });
});

const PORT = Number(process.env.PORT) || 4000;
httpServer.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));