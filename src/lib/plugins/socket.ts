// useSocket.ts
import { io } from "socket.io-client";

const host = import.meta.env.VITE_BACKEND + "/chat";
const jwt = localStorage.getItem("jwt");
const Chatsocket = io(host, {
  auth: {
    token: jwt, // or cookie/session if needed
  },
});

export { Chatsocket };
