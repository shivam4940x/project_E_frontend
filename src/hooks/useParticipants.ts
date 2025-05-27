import { useQuery } from "@tanstack/react-query";
import type { UserObj } from "@/types/Response";
import { Chatsocket } from "@/lib/plugins/socket";

const fetchParticipants = (conversationId: string) =>
  new Promise<UserObj[]>((resolve, reject) => {
    const timeout = setTimeout(() => reject("Timeout"), 5000);

    const handle = (data: { success: boolean; participants: UserObj[] }) => {
      clearTimeout(timeout);
      if (data.success) resolve(data.participants);
      else reject("Failed to join conversation");
    };

    Chatsocket.emit("join", { conversationId });
    Chatsocket.once("joined", handle);
  });

export const useParticipants = (conversationId?: string) => {
  return useQuery({
    queryKey: ["participants", conversationId],
    queryFn: () => fetchParticipants(conversationId!),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
