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

const getChatQueryKey = (conversationId?: string) => ["chat", conversationId];

export const useChat = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await ChatService.delete(id);
      return res.data;
    },
    onSuccess: (
      _,
      variables: { id: string; conversationId: string; onSuccess?: () => void }
    ) => {
      variables.onSuccess?.(); // 👈 optimistic UI update
      queryClient.invalidateQueries({
        queryKey: getChatQueryKey(variables.conversationId),
      });
    },
    onError,
  });

  const editMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await ChatService.edit(id);
      return res.data;
    },
    onSuccess: (_, variables: { id: string; conversationId: string }) => {
      queryClient.invalidateQueries({
        queryKey: getChatQueryKey(variables.conversationId),
      });
    },
    onError,
  });

  const useInfinity = (
    limit: number = 50,
    conversationId?: string
  ): UseInfiniteQueryResult<InfiniteData<MessageAll>, Error> => {
    return useInfiniteQuery<MessageAll, Error>({
      queryKey: getChatQueryKey(conversationId),
      queryFn: async ({ pageParam = 1 }) => {
        if (!conversationId) throw new Error("Conversation ID is required.");
        const res = await ChatService.getAll(
          pageParam as number,
          limit,
          conversationId
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const fetched = allPages.reduce(
          (acc, page) => acc + page.messages.length,
          0
        );
        return fetched < lastPage.total ? allPages.length + 1 : undefined;
      },
      enabled: !!conversationId,
    });
  };

  return {
    useInfinity,
    deleteChat: deleteMutation.mutate,
    editChat: editMutation.mutate,
  };
};
