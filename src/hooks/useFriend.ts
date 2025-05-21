/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FriendService from "@/services/friend.service";
import type { FriendRequestObj } from "@/types/Response";

const onError = (error: any) => {
  const msg: string = error?.response?.data?.message as string;
  if (msg) {
    toast.error(msg);
  } else {
    toast.error("An unknown error occurred");
  }
};
const useFriend = () => {
  const queryClient = useQueryClient();

  // Add Friend Mutation
  const addFriendMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await FriendService.sendRequest(id);
    },
    onSuccess: () => {
      toast.success("Request sent successfully");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError,
  });

  // Get Friend Requests
  const getRequestsQuery = useQuery<FriendRequestObj, Error>({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const response = await FriendService.getRequests();
      return response.data;
    },
    staleTime: 2000,
  });

  // Accept Request Mutation
  const acceptFriendMutation = useMutation({
    mutationFn: async (id: string) => {
      return await FriendService.accept(id);
    },
    onSuccess: () => {
      toast.success("Friend request accepted");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError,
  });

  // Reject Request Mutation
  const rejectFriendMutation = useMutation({
    mutationFn: async (id: string) => {
      return await FriendService.reject(id);
    },
    onSuccess: () => {
      toast.info("Friend request rejected");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError,
  });
  // cancel Request Mutation
  const cancelFriendMutation = useMutation({
    mutationFn: async (id: string) => {
      return await FriendService.reject(id);
    },
    onSuccess: () => {
      toast.success("Friend request canceled");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError,
  });

  return {
    addFriend: addFriendMutation.mutate,
    addFriendStatus: {
      isPending: addFriendMutation.isPending,
      isSuccess: addFriendMutation.isSuccess,
      isError: addFriendMutation.isError,
    },
    acceptFriend: acceptFriendMutation.mutate,
    rejectFriend: rejectFriendMutation.mutate,
    cancelFriend: cancelFriendMutation.mutate,
    friendRequests: getRequestsQuery.data,
    friendRequestsStatus: {
      isLoading: getRequestsQuery.isLoading,
      isError: getRequestsQuery.isError,
      isSuccess: getRequestsQuery.isSuccess,
    },
    refetchRequests: getRequestsQuery.refetch,
  };
};

export { useFriend };
