import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { CurrentUser, UserGetAll } from "@/types/Response";
import UserService from "../services/user.service";

export const useUsers = () => {
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

    useCurrentUser: (): UseQueryResult<CurrentUser, Error> => {
      return useQuery<CurrentUser, Error>({
        queryKey: ["user"],
        queryFn: async () => {
          const user = await UserService.get();
          return user.data;
        },
      });
    },
  };
};


// export const useCurrentUser = async () => {
//   return await UserService.get();
// };
