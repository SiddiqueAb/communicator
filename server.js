const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ─── In-memory user registry ──────────────────────────────────────────────────
// userId (6-digit string) → socketId
const users = new Map();
// socketId → userId
const socketToUser = new Map();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateUserId() {
  let id;
  do {
    id = Math.floor(100000 + Math.random() * 900000).toString();
  } while (users.has(id));
  return id;
}

function getSocketId(userId) {
  return users.get(userId) || null;
}

function relay(targetUserId, event, payload) {
  const sid = getSocketId(targetUserId);
  if (sid) io.to(sid).emit(event, payload);
  return !!sid;
}

// ─── Connection handler ───────────────────────────────────────────────────────
io.on('connection', (socket) => {
  const userId = generateUserId();
  users.set(userId, socket.id);
  socketToUser.set(socket.id, userId);

  console.log(`[+] ${userId} connected  (socket: ${socket.id})`);

  // Immediately tell the client its assigned ID
  socket.emit('your-id', userId);

  // ── Chat ─────────────────────────────────────────────────────────────────
  socket.on('send-message', ({ to, message }) => {
    const from = socketToUser.get(socket.id);
    const delivered = relay(to, 'receive-message', {
      from,
      message,
      timestamp: new Date().toISOString(),
    });
    if (!delivered) {
      socket.emit('user-not-found', { id: to });
    }
  });

  // ── WebRTC signaling ──────────────────────────────────────────────────────

  // Caller → callee: send offer
  socket.on('call-user', ({ to, offer, callType }) => {
    const from = socketToUser.get(socket.id);
    const delivered = relay(to, 'incoming-call', { from, offer, callType });
    if (!delivered) {
      socket.emit('user-not-found', { id: to });
    }
  });

  // Callee → caller: send answer
  socket.on('answer-call', ({ to, answer }) => {
    relay(to, 'call-answered', { answer });
  });

  // Callee → caller: reject
  socket.on('reject-call', ({ to }) => {
    relay(to, 'call-rejected', {});
  });

  // Both sides: relay ICE candidates
  socket.on('ice-candidate', ({ to, candidate }) => {
    relay(to, 'ice-candidate', { candidate });
  });

  // Either side: hang up
  socket.on('end-call', ({ to }) => {
    relay(to, 'call-ended', {});
  });

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const uid = socketToUser.get(socket.id);
    if (uid) {
      users.delete(uid);
      socketToUser.delete(socket.id);
      console.log(`[-] ${uid} disconnected`);
    }
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Signaling server listening on http://localhost:${PORT}\n`);
});
