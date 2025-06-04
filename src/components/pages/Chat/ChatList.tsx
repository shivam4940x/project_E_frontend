import Loading from "@/components/ui/Loading";
import { useFriend } from "@/hooks/useFriend";
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Fragment, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";

const ChatList = () => {
  const { useInfinty } = useFriend();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinty(10);

  useIntersectionObserver({
    targetRef: loadMoreRef as RefObject<HTMLElement>,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });
  if (isLoading) {
    return (
      <div className="div center text-white">
        <Loading />
      </div>
    );
  }
  if (isError) {
    return <div className="div center text-white">Error loading</div>;
  }
  return (
    <div className="">
      <div id="chat_list" className="py-2 lg:py-5">
        <Typography className="mb-3 pb-3 border-b border-white-l/10">
          <span className="text-base px-4 text-gray-300/70">Direct message</span>
        </Typography>
        <List className="p-0">
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.friendList.map((user) => (
                <Link
                  key={user.id}
                  to={`/c/${user.chatId}`}
                  className="hover:bg-white-l/10 duration-75"
                >
                  <ListItem
                    alignItems="center"
                    className="mr-2 md:py-4 py-2 justify-between group cursor-pointer"
                  >
                    <div className="flex">
                      <ListItemAvatar>
                        <Avatar
                          alt={user.username}
                          src={user.profile.avatar}
                          className="h-8 w-8 md:h-10 md:w-10"
                        />
                      </ListItemAvatar>
                      <ListItemText className="text-sm md:text-base">
                        {user.username}
                      </ListItemText>
                    </div>
                  </ListItem>
                </Link>
              ))}
            </Fragment>
          ))}
        </List>

        {hasNextPage && !isFetchingNextPage && (
          <div ref={loadMoreRef} className="h-1 w-full" />
        )}

        {isFetchingNextPage && (
          <div className="text-center text-white">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatList;
