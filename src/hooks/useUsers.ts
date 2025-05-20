import { useInfiniteQuery } from "@tanstack/react-query";
import type { UserGetAll } from "@/types/Response";
import UserService from "../services/user.service";
import { useEffect } from "react";

export const useUsers = (limit = 5) => {
  return useInfiniteQuery<UserGetAll, Error>({
    queryKey: ["users"],
    queryFn: async ({ pageParam = 1 }) => {
      const page = (pageParam as number) || 1;
      const res = await UserService.getAll(page, limit);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.users.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
};

type UseIntersectionObserverProps = {
  targetRef: React.RefObject<HTMLElement>;
  onIntersect: () => void;
  enabled?: boolean; // Optional flag to enable/disable the observer
};

export const useIntersectionObserver = ({
  targetRef,
  onIntersect,
  enabled = true,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    // Create the intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    // Start observing the target element
    observer.observe(target);

    // Cleanup observer on component unmount or when target changes
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [targetRef, onIntersect, enabled]);
};

// export const useCurrentUser = async () => {
//   return await UserService.get();
// };
