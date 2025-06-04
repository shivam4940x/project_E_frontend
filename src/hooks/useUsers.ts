import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { UserObj, UserGetAll } from "@/types/Response";
import UserService from "../services/user.service";
import type { UserQuery } from "@/types/SharedProps";
import { toast } from "react-toastify";
import { onError } from "@/lib/other";
import type { UserPayload } from "@/types/Form";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: async (payload: UserPayload) => {
      return await UserService.update(payload);
    },
    onSuccess: () => {
      toast.success("User update successfully");
      queryClient.invalidateQueries({ queryKey: ["CurrentUser"] });
    },
    onError,
  });

  return {
    useInfinty: (
      limit: number = 5
    ): UseInfiniteQueryResult<InfiniteData<UserGetAll>, Error> => {
      return useInfiniteQuery<UserGetAll, Error>({
        queryKey: ["users"],
        queryFn: async ({ pageParam = 1 }) => {
          const page = pageParam as number;
          const res = await UserService.getAll(page, limit);
          return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
          const totalFetched = allPages.reduce(
            (acc, page) => acc + page.users.length,
            0
          );
          return totalFetched < lastPage.total
            ? allPages.length + 1
            : undefined;
        },
      });
    },
    useCurrentUser: (params?: UserQuery): UseQueryResult<UserObj, Error> => {
      return useQuery<UserObj, Error>({
        queryKey: params ? ["CurrentUser", params] : ["CurrentUser"],
        queryFn: async () => {
          const user = await UserService.get(params);
          return user.data;
        },
      });
    },
    GetUser: (id: string): UseQueryResult<UserObj, Error> => {
      return useQuery<UserObj, Error>({
        queryKey: ["user"],
        queryFn: async () => {
          const user = await UserService.get(id);
          return user.data;
        },
      });
    },
    updateUser: {
      fn: updateUser.mutate,
      isPending: updateUser.isPending,
    },
  };
};

// export const useCurrentUser = async () => {
//   return await UserService.get();
// };
