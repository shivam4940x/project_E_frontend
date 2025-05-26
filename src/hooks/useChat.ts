import ChatService from "@/services/chat.service";
import type { MessageAll } from "@/types/Response";
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

export const useChat = () => {
  return {
    useInfinty: (
      limit: number = 50,
      conversationId: string | undefined
    ): UseInfiniteQueryResult<InfiniteData<MessageAll>, Error> => {
      return useInfiniteQuery<MessageAll, Error>({
        queryKey: ["chat", conversationId],
        queryFn: async ({ pageParam = 1 }) => {
          const page = pageParam as number;
          if (!conversationId) {
            throw new Error("convo id not provided");
          }
          const res = await ChatService.getAll(page, limit, conversationId);
          return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
          const totalFetched = allPages.reduce(
            (acc, page) => acc + page.messages.length,
            0
          );
          return totalFetched < lastPage.total
            ? allPages.length + 1
            : undefined;
        },
        enabled: !!conversationId,
      });
    },
  };
};
