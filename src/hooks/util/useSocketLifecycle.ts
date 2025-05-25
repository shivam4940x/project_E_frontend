// hooks/useSocketLifecycle.ts
import { useEffect } from "react";
import { Chatsocket } from "@/lib/plugins/socket";

export const useSocketLifecycle = () => {
  useEffect(() => {
    Chatsocket.connect(); // Ensure connection

    const cleanup = () => {
      // Optional: emit disconnect-related events
      // socket.emit("user_disconnected", { userId });

      Chatsocket.disconnect(); // Force disconnection
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup(); // Component unmount
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);
};
