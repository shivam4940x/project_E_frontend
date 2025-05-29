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
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import Loading from "../ui/Loading";
import ClearIcon from "@mui/icons-material/Clear";
import GroupIcon from "@mui/icons-material/Groups";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
const Chats = ({ togglePage }: { togglePage?: () => void }) => {
  const { useInfinty } = useFriend();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
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
      <div>
        <div className="bg-black/10 px-3 py-4 border-b border-white-l/10  hidden lg:flex">
          <Button className="center w-max lg:w-full px-4 pr-6 h-8 bg-white-l/10 rounded-md gap-2">
            <div className="center ">
              <SearchIcon className="text-base" />
            </div>
            <span>search chat</span>
          </Button>
          <Typography className="w-max mx-auto flex justify-center items-center lg:hidden">
            <span className="text-sm px-4 text-gray-300/60">
              Direct message
            </span>
          </Typography>
        </div>
        <div className="p-4 lg:hidden space-y-4">
          <Typography variant="h5">
            <span className="text-white-l/70">Messages</span>
          </Typography>
          <div className="flex gap-4">
            <div className="rounded-full bg-white/10 p-1.5">
              <SearchIcon className="text-lg w-6 aspect-square rounded-full" />
            </div>
            <div className="rounded-full grow center bg-white-l/10 center space-x-2 text-sm">
              <span>
                <PersonAddIcon className="text-base" />
              </span>
              <span>Add Friend</span>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="bg-black/10 px-3 py-4">
            <Link to="/">
              <Button
                className={`flex justify-start gap-5 px-4 w-full h-12 hover:bg-white-l/10 rounded-xl duration-75 ${
                  location.pathname == "/" ? "bg-white-l/10" : ""
                }`}
              >
                <GroupIcon className="text-white/50 text-xl" />
                <span>Friends</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Divider flexItem orientation="horizontal" className="bg-white-l/10" />
      <div id="chat_list" className="py-2 lg:py-5">
        <Typography className="mb-2 hidden lg:block">
          <span className="text-sm px-4 text-gray-300/60">Direct message</span>
        </Typography>
        <List className="p-0">
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.friendList.map((user) => (
                <Link
                  key={user.id}
                  to={`/c/${user.chatId}`}
                  onClick={() => {
                    if (togglePage) {
                      togglePage();
                    }
                  }}
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

                    <div className="btns flex gap-3">
                      <Button className="chat rounded-full aspect-square min-w-8 group-hover:flex hidden">
                        <ClearIcon className="text-sm" />
                      </Button>
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
export { Settings, Chats };
