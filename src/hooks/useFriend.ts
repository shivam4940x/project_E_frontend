/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FriendService from "@/services/friend.service";
import type { FriendRequest } from "@/types/Response";

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
    onError: (error: any) => {
      const msg: string = error?.response?.data?.message as string;
      const errorMessages: Record<string, string> = {
        "you cannot add yourself": "You cannot add yourself as a friend.",
        "invalid userid": "The user ID is invalid.",
        "friend request already sent":
          "You have already sent a friend request to this user.",
        "friend request already accepted":
          "You are already friends with this user.",
        "friend request already declined":
          "This friend request has been declined already.",
        "unknown error": "An unknown error occurred. Please try again later.",
      };
      const message = msg?.toLowerCase();
      if (message && errorMessages[message]) {
        toast.success(errorMessages[message]);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  // Get Friend Requests
  const getRequestsQuery = useQuery<FriendRequest, Error>({
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
    onError: () => {
      toast.error("Failed to accept request");
    },
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
    onError: () => {
      toast.error("Failed to reject request");
    },
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
