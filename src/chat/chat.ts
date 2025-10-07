import { Router } from "express";
import { pool } from "../chat/db.js";
const router = Router();

/**
 * Get or create chat_room for a section
 * GET /api/chat/rooms/by-section/:sectionId
 */
router.get("/rooms/by-section/:sectionId", async (req, res) => {
  const sectionId = Number(req.params.sectionId);
  if (!sectionId) return res.status(400).send({ error: "Invalid sectionId" });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM chat_rooms WHERE section_id = ?", [sectionId]);
    if ((rows as any[]).length) return res.json((rows as any[])[0]);

    const [r] = await conn.query("INSERT INTO chat_rooms (section_id, name) VALUES (?, ?)", [
      sectionId,
      `Section ${sectionId} Room`,
    ]);
    const insertId = (r as any).insertId;
    const [roomRows] = await conn.query("SELECT * FROM chat_rooms WHERE id = ?", [insertId]);
    res.json((roomRows as any[])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "DB error" });
  } finally {
    conn.release();
  }
});

/** Get messages for a room (pagination optional) */
router.get("/rooms/:roomId/messages", async (req, res) => {
  const roomId = Number(req.params.roomId);
  if (!roomId) return res.status(400).send({ error: "Invalid roomId" });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT cm.id, cm.room_id, cm.sender_id, u.name as sender_name, cm.message, cm.timestamp
       FROM chat_messages cm
       JOIN users u ON u.id = cm.sender_id
       WHERE cm.room_id = ?
       ORDER BY cm.id ASC
       LIMIT 100`,
      [roomId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "DB error" });
  } finally {
    conn.release();
  }
});

/** Post a message (used by REST fallback) */
router.post("/rooms/:roomId/messages", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const { sender_id, message } = req.body;
  if (!roomId || !sender_id || !message) return res.status(400).send({ error: "Missing fields" });

  const conn = await pool.getConnection();
  try {
    const [r] = await conn.query(
      "INSERT INTO chat_messages (room_id, sender_id, message) VALUES (?, ?, ?)",
      [roomId, sender_id, message]
    );
    const insertId = (r as any).insertId;
    const [rows] = await conn.query(
      `SELECT cm.id, cm.room_id, cm.sender_id, u.name as sender_name, cm.message, cm.timestamp
       FROM chat_messages cm
       JOIN users u ON u.id = cm.sender_id
       WHERE cm.id = ?`,
      [insertId]
    );
    res.status(201).json((rows as any[])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "DB error" });
  } finally {
    conn.release();
  }
});

export default router;