// useSocket.ts
import { io } from "socket.io-client";

const jwt = localStorage.getItem("jwt");
const Chatsocket = io("http://localhost:3000/chat", {
  auth: {
    token: jwt, // or cookie/session if needed
  },
});

export { Chatsocket };
