import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import Loading from "@/components/ui/Loading";

import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/hooks/useUsers";
import { useFriend } from "@/hooks/useFriend";
import { copyText } from "@/lib/other";
//types
import type { FriendsAll, UserGetAll } from "@/types/Response";
import type { InfiniteData } from "@tanstack/react-query";

interface UserListViewerProps {
  type: "friends" | "users";
  data: InfiniteData<FriendsAll> | InfiniteData<UserGetAll>; // Pass the data prop instead of fetching here
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
}

const UserListViewer = ({
  type,
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
}: UserListViewerProps) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | {
    anchor: HTMLElement;
    userId: string;
  }>(null);
  const { remove } = useFriend();
  const handleChat = (id: string) => navigate(`/chat/${id}`);
  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => setMenuAnchor({ anchor: e.currentTarget, userId });

  // Fetch more data when the user scrolls near the bottom of the list
  useIntersectionObserver({
    targetRef: loadMoreRef as React.RefObject<HTMLElement>,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });
  if (isLoading) {
    return (
      <div className="text-white center p-4 h-full w-full">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div className="text-white">Error fetching {type}</div>;
  }

  const title =
    type === "friends" ? `All Friends - ${data?.pages[0].total}` : "All Users";

  return (
    <div className="div overflow-y-scroll overflow-x-hidden py-4">
      <Typography className="p-2 border-b border-white-l/10 text-sm flex ">
        {type == "friends" ? (
          <span className="pb-2">{title}</span>
        ) : (
          <span className="pb-4 center w-full">{title}</span>
        )}
      </Typography>

      <List sx={{ width: "100%" }} className="p-0">
        {data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {(type === "friends"
              ? (page as FriendsAll).friendList
              : (page as UserGetAll).users
            ).map((user, i: number) => (
              <div
                key={user.id}
                className="hover:bg-dull-black/10 duration-75 brightness-75 hover:brightness-100"
              >
                <ListItem
                  alignItems="center"
                  className="mr-2 py-4 justify-between group cursor-pointer"
                >
                  <div className="flex">
                    <ListItemAvatar>
                      <Avatar alt={user.username} src={user.profile.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span className="text-white">{user.username}</span>
                      }
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    {type === "friends" && (
                      <Tooltip title="Chat">
                        <Button
                          onClick={() => handleChat(user.id)}
                          className="rounded-full aspect-square min-w-12 group-hover:bg-dull-black/50 center"
                        >
                          <ChatBubbleIcon className="text-[17px]" />
                        </Button>
                      </Tooltip>
                    )}

                    {type === "friends" ? (
                      <>
                        <Tooltip title="More actions">
                          <Button
                            onClick={(e) => handleMenuClick(e, user.id)}
                            className="rounded-full aspect-square min-w-12 group-hover:bg-dull-black/50 center"
                          >
                            <MoreVertIcon />
                          </Button>
                        </Tooltip>

                        {menuAnchor?.userId === user.id && (
                          <Menu
                            anchorEl={menuAnchor.anchor}
                            open={true}
                            onClose={() => setMenuAnchor(null)}
                            slotProps={{
                              paper: {
                                className:
                                  "bg-dull-black text-white-l py-px rounded-lg min-w-40 border border-white-l/10 shadow-md px-2",
                              },
                            }}
                          >
                            <MenuItem
                              className="w-full p-0"
                              onClick={() => {
                                remove({ id: user.id });
                                setMenuAnchor(null);
                              }}
                            >
                              <div className="text-xs capitalize py-2 px-3 w-full text-soft-red hover:bg-soft-red/10 rounded-sm">
                                Remove Friend
                              </div>
                            </MenuItem>
                          </Menu>
                        )}
                      </>
                    ) : (
                      <Tooltip title="Copy User ID">
                        <Button
                          onClick={() => copyText(user.id)}
                          className="py-2"
                        >
                          <ContentCopyIcon className="text-sm mx-1" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </ListItem>

                {i !==
                  (type === "friends"
                    ? (page as FriendsAll).friendList
                    : (page as UserGetAll).users
                  ).length -
                    1 && (
                  <Divider
                    variant="inset"
                    component="div"
                    className="border-light-blue/10 mx-3"
                  />
                )}
              </div>
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
  );
};

const AllUsers = () => {
  const { useInfinty: useUsersInf } = useUsers();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useUsersInf(10);

  return (
    <UserListViewer
      type="users"
      data={data as InfiniteData<UserGetAll>}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

const AllFriends = () => {
  const { useInfinty: useFriendInf } = useFriend();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFriendInf(10);

  return (
    <UserListViewer
      type="friends"
      data={data as InfiniteData<FriendsAll>}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export { AllUsers, AllFriends };
