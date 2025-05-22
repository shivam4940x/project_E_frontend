import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
// import useUserStore from "@/store/user.store";
import { useUsers } from "@/hooks/useUsers";
import { useFriend } from "@/hooks/useFriend";
import { Fragment, useRef, type RefObject } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loading from "../ui/Loading";
import ClearIcon from "@mui/icons-material/Clear";

const Settings = () => {
  // const { user } = useUserStore();
  const { data: user, error } = useUsers().useCurrentUser();
  return (
    <div className="h-full w-full  ">
      <Card className="flex center p-1 bg-transparent">
        <Avatar
          src={user?.profile.avatar}
          alt={user?.username}
          className="mr-2"
        />
        <Typography variant="h6" className="capitalize">
          <span className="text-sm">
            {error ? error.message : user?.username}
          </span>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <SettingsIcon className="text-gray-300 hover:rotate-90 duration-200 transition-transform " />
        </IconButton>
      </Card>
    </div>
  );
};
const Chats = () => {
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
      <div className="bg-black/10 px-3 py-4">
        <Button className="center w-full h-8 bg-white-l/10 rounded-md">
          search chat
        </Button>
      </div>
      <Divider flexItem orientation="horizontal" className="bg-white-l/10" />
      <div id="chat_list" className=" py-5">
        <Typography className="mb-2">
          <span className="text-sm px-4 text-gray-300/60">Direct message</span>
        </Typography>
        <List  className="p-0">
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.friendList.map((user) => (
                <div key={user.id} className="hover:bg-white-l/10 duration-75">
                  <ListItem
                    alignItems="center"
                    className="mr-2 py-4 justify-between group cursor-pointer"
                  >
                    <div className="flex">
                      <ListItemAvatar>
                        <Avatar alt={user.username} src={user.profile.avatar} />
                      </ListItemAvatar>
                      <ListItemText>{user.username}</ListItemText>
                    </div>

                    <div className="btns flex gap-3">
                      <Button className="chat rounded-full aspect-square min-w-8 group-hover:flex hidden">
                        <ClearIcon className="text-sm"/>
                      </Button>
                    </div>
                  </ListItem>
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
    </div>
  );
};
export { Settings, Chats };
