import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserObj } from "@/types/Response";
import { Chatsocket } from "@/lib/plugins/socket";

const getParticipantsKey = (conversationId?: string) => [
  "participants",
  conversationId,
];

export const useParticipants = (conversationId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId || conversationId === "0") return;

    const controller = new AbortController();

    const joinRoom = () => {
      Chatsocket.emit("join", { conversationId });

      const handle = (data: { success: boolean; participants: UserObj[] }) => {
        if (!data.success || controller.signal.aborted) return;
        queryClient.setQueryData(
          getParticipantsKey(conversationId),
          data.participants
        );
      };

      Chatsocket.once("joined", handle);

      return () => {
        controller.abort();
        Chatsocket.off("joined", handle);
      };
    };

    const cleanup = joinRoom();
    return cleanup;
  }, [conversationId, queryClient]);

  return useQuery({
    queryKey: getParticipantsKey(conversationId),
    queryFn: async () => {
      // Return stale cache or wait for socket side-effect to hydrate
      return (queryClient.getQueryData(getParticipantsKey(conversationId)) ??
        new Promise<UserObj[]>((_, reject) =>
          reject("Waiting for socket...")
        )) as UserObj[];
    },
    enabled: !!conversationId && conversationId !== "0",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
