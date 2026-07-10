import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

export const connectSocket = (userId) => {
  socket.connect();
  socket.emit("user:online", userId);
};

export const disconnectSocket = () => socket.disconnect();

export default socket;
