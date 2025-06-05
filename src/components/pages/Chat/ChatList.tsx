import Loading from "@/components/ui/Loading";
import { useFriend } from "@/hooks/useFriend";
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
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
      <div id="chat_list" className="lg:pb-5">
        <Typography className="mb-3 py-6 border-b border-white-l/10 min-w-60">
          <span className="text-base px-4 text-gray-300/70">
            Direct message
          </span>
        </Typography>
        <List className="p-0 min-w-72 w-full">
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.friendList.map((user) => (
                <ListItem
                  key={user.id}
                  alignItems="center"
                  className="hover:bg-white-l/10 mr-2 p-1 rounded-xl overflow-hidden duration-75 my-4"
                >
                  <Link
                    to={`/c/${user.chatId}`}
                    className="px-3 py-2 flex gap-4 items-center group w-full "
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={user.username}
                        src={user.profile.avatar}
                        className="h-11 w-11"
                      />
                    </ListItemAvatar>
                    <ListItemText className="text-white-l">
                      {user.username}
                    </ListItemText>
                  </Link>
                </ListItem>
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
