import Message from "../models/Message.js";

const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User comes online
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    // Join a match chat room
    socket.on("chat:join", (matchId) => {
      socket.join(matchId);
    });

    // Send a message via socket
    socket.on("chat:message", async ({ matchId, senderId, content }) => {
      try {
        const message = await Message.create({ matchId, sender: senderId, content });
        const populated = await message.populate("sender", "name avatar");
        io.to(matchId).emit("chat:message", populated);
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("chat:typing", ({ matchId, userId, name }) => {
      socket.to(matchId).emit("chat:typing", { userId, name });
    });

    socket.on("chat:stopTyping", ({ matchId }) => {
      socket.to(matchId).emit("chat:stopTyping");
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
