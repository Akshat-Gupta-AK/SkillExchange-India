import { io } from "socket.io-client";

const socket = io("https://skillexchange-india-2.onrender.com", { autoConnect: false });

export const connectSocket = (userId) => {
  socket.connect();
  socket.emit("user:online", userId);
};

export const disconnectSocket = () => socket.disconnect();

export default socket;
