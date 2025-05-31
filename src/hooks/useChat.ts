import { onError } from "@/lib/other";
import ChatService from "@/services/chat.service";
import type { MessageAll } from "@/types/Response";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

export const useChat = () => {
  const queryClient = useQueryClient();

  const useDelete = useMutation({
    mutationFn: async ({
      id,
      conversationId,
    }: {
      id: string;
      conversationId: string;
    }) => {
      const res = await ChatService.delete(id);
      console.log(conversationId);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.conversationId],
      });
    },
    onError,
  });
  const edit = useMutation({
    mutationFn: async ({
      id,
      conversationId,
    }: {
      id: string;
      conversationId: string;
    }) => {
      const res = await ChatService.edit(id);
      console.log(conversationId);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.conversationId],
      });
    },
    onError,
  });
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
    deleteChat: useDelete.mutate,
    editChat: edit.mutate,
  };
};
