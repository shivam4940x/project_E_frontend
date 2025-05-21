import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Loading from "../ui/Loading";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { copyText } from "@/lib/other";
import GroupIcon from "@mui/icons-material/Groups";
import type { DashboardContent } from "@/types/SharedProps";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../utility/FormInput";
import { useFriend, useFriendRequest } from "@/hooks/useFriend";
import CloseIcon from "@mui/icons-material/Close";
import type { FriendRequestObj } from "@/types/Response";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

type NavProps = {
  setContent: Dispatch<SetStateAction<DashboardContent>>;
  currentContent: DashboardContent;
};

const Nav = ({ setContent, currentContent }: NavProps) => {
  const FriendsAction = [
    { title: "all", value: "all" },
    { title: "requests", value: "requests" },
    { title: "add friends", value: "add" },
  ];

  return (
    <div className="border-b border-light-blue/20 w-full h-full px-4 backdrop-blur-sm">
      <div className="flex items-center h-full gap-4">
        <div className="flex items-center gap-2 text-white">
          <GroupIcon className="text-white/50 text-base" />
          Friends
        </div>
        <Divider
          orientation="vertical"
          flexItem
          className="border-red-200/20 my-2 mx-4"
        />
        <ul>
          <li>
            <div className="flex gap-5 capitalize">
              {FriendsAction.map((action, index) => {
                const isActive = currentContent === action.value;
                const variant: "text" | "outlined" | "contained" =
                  action.value === "add" ? "contained" : "text";

                const baseClass = [];

                if (isActive) {
                  baseClass.push("bg-[var(--color-btn-text-hovored)]");
                }

                if (variant === "contained" && isActive) {
                  baseClass.push("text-dark-blue");
                }

                return (
                  <Button
                    key={index}
                    onClick={() => setContent(action.value as DashboardContent)}
                    variant={variant}
                    className={baseClass.join(" ")}
                  >
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const AllUsers = () => {
  const { useInfinty } = useUsers();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinty(10);

  // Reference for the load more trigger element
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Using the Intersection Observer to trigger fetchNextPage when scrolled to the bottom
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
      <div className="text-white h-full center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div className="text-white">Error fetching users</div>;
  }

  return (
    <div className="w-full h-full backdrop-blur-sm overflow-y-scroll overflow-x-hidden">
      <List sx={{ width: "100%", maxWidth: 360 }}>
        {data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.users.map((user, i) => (
              <div
                key={user.id}
                className="brightness-75 hover:brightness-100 duration-75"
              >
                <ListItem alignItems="center" className="mr-2">
                  <ListItemAvatar>
                    <Avatar alt={user.email} src={user.profile.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    className="text-white space-y-1 py-2 my-2"
                    primary={
                      <Fragment>
                        <span className="flex justify-between gap-3">
                          <span>{user.username}</span>
                          <Button
                            component="span"
                            onClick={() => {
                              copyText(user.id);
                            }}
                            className="py-2"
                          >
                            <ContentCopyIcon className="text-sm mx-1" />
                          </Button>
                        </span>
                      </Fragment>
                    }
                  />
                </ListItem>
                {i !== page.users.length - 1 && (
                  <Divider
                    variant="inset"
                    component="li"
                    className="border-light-blue/10 mx-3"
                  />
                )}
              </div>
            ))}
          </Fragment>
        ))}
      </List>

      {/* Trigger element for infinite scroll */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-1 w-full" />
      )}

      {/* Loading spinner when fetching next page */}
      {isFetchingNextPage && (
        <div className="text-center text-white">
          <Loading />
        </div>
      )}
    </div>
  );
};

const AddFriend = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ id: string }>();
  const {
    addFriend,
    addFriendStatus: { isPending },
  } = useFriend();
  const userId = watch("id");
  const isDisabled = !userId || userId.trim() === "";
  const onSubmit = async (data: { id: string }) => {
    if (isPending) return;
    addFriend({
      id: data.id,
    });
    reset();
  };

  return (
    <div className="">
      <div className="mb-5">
        <Typography variant="h4">add friend</Typography>
        <Typography variant="h5">
          <span className="normal-case text-sm text-gray-300">
            You can add a friend using their user ID
          </span>
        </Typography>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex bg-paper-black/50 backdrop-blur-xs gap-4 h-16 rounded-xl"
      >
        <CustomTextField
          placeholder="User Id"
          type="text"
          variant="outlined"
          className="grow border-0"
          InpclassName="h-8 px-4 "
          register={register}
          name="id"
          validation={{ required: "User ID is required" }}
          error={errors.id}
          helperText={errors.id?.message}
        />

        <Button
          type="submit"
          variant="contained"
          className={`normal-case my-3 mx-4  ${
            isDisabled ? "!cursor-not-allowed pointer-events-auto" : ""
          }`}
          disabled={isSubmitting}
          sx={{ textTransform: "none" }}
        >
          Send Friend Request
        </Button>
      </form>
    </div>
  );
};

const Requests = () => {
  const { friendRequests, cancelFriend, acceptFriend, rejectFriend } =
    useFriendRequest();
  const [Requests, setRequests] = useState<
    | FriendRequestObj
    | { onGoingRequests: undefined; inComingRequests: undefined }
  >();

  useEffect(() => {
    if (friendRequests) {
      setRequests(friendRequests);
      console.log(friendRequests);
    }
  }, [friendRequests]);

  return (
    <div>
      {Requests?.onGoingRequests && Requests?.onGoingRequests.length > 0 && (
        <div className="space-y-4" id="outgoing_Requests">
          <Typography
            variant="h5"
            className="border-b border-white-l/10 py-2 h-12 flex items-end px-1"
          >
            <span>Outgoing requests</span>
          </Typography>
          <List
            sx={{ width: "100%" }}
            className="bg-dull-black/20 rounded-xl p-0"
          >
            {Requests.onGoingRequests.map((request) => (
              <div
                key={request.id}
                className="hover:bg-dull-black/10  duration-100 h-20 w-full center border-b border-white-l/20 last:border-b-0"
              >
                <ListItem alignItems="center" className="mr-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex gap-2 items-center">
                      <ListItemAvatar className="center">
                        <Avatar
                          alt={request.addressee.username}
                          src={request.addressee.profile.avatar}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.addressee.username}
                        secondary={
                          <Fragment>
                            <span className="text-sm text-gray-400 pl-1">
                              <span></span>
                              <span>pending</span>
                            </span>
                          </Fragment>
                        }
                      />
                    </div>
                    <div className="space-x-5">
                      <Tooltip
                        title="Cancel Friend Request"
                        arrow
                        placement="top"
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          className="aspect-square rounded-full min-w-10 max-w-10"
                          onClick={() => cancelFriend(request.addresseeId)}
                        >
                          <CloseIcon />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </ListItem>
              </div>
            ))}
          </List>
        </div>
      )}
      {Requests?.inComingRequests && Requests?.inComingRequests.length > 0 && (
        <div className="space-y-4" id="incoming_Requests">
          <Typography
            variant="h5"
            className="border-b border-white-l/10 py-2 h-12 flex items-end px-1"
          >
            <span>Incoming requests</span>
          </Typography>
          <List
            sx={{ width: "100%" }}
            className="bg-dull-black/20 rounded-xl p-0"
          >
            {Requests.inComingRequests.map((request) => (
              <div
                key={request.id}
                className="hover:bg-dull-black/10  duration-100 h-20 w-full center border-b border-white-l/20 last:border-b-0"
              >
                <ListItem alignItems="center" className="mr-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex gap-2 items-center">
                      <ListItemAvatar className="center">
                        <Avatar
                          alt={request.requester.username}
                          src={request.requester.profile.avatar}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.requester.username}
                        secondary={
                          <Fragment>
                            <span className="text-sm text-gray-400 pl-1">
                              <span></span>
                              <span>pending</span>
                            </span>
                          </Fragment>
                        }
                      />
                    </div>
                    <div className="space-x-5">
                      <Tooltip title=" Accept Request" arrow placement="top">
                        <Button
                          variant="text"
                          color="success"
                          size="small"
                          onClick={() => {
                            acceptFriend(request.requesterId);
                          }}
                        >
                          Accept
                        </Button>
                      </Tooltip>
                      <Tooltip title="Reject Request" arrow placement="top">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            rejectFriend(request.requesterId);
                          }}
                        >
                          Decline
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </ListItem>
              </div>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

const AllFriends = () => {
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
      <div className="text-white h-full center">
        <div className="w-full h-full overflow-y-scroll overflow-x-hidden py-4">
          <div className="p-2 border-b border-white-l/10 my-0 text-sm">
            <Skeleton width={100} height={20} />
          </div>
          <List sx={{ width: "100%" }} className="p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="hover:bg-dull-black/10 duration-75">
                <ListItem alignItems="center" className="mr-2 py-4">
                  <ListItemAvatar>
                    <Skeleton variant="circular">
                      <Avatar />
                    </Skeleton>
                  </ListItemAvatar>
                  <div className="ml-4 w-full">
                    <Skeleton width="40%" height={20} />
                  </div>
                </ListItem>
                {i !== 5 && (
                  <Divider
                    variant="inset"
                    component="div"
                    className="border-light-blue/10 w-full m-0"
                  />
                )}
              </div>
            ))}
          </List>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-white">Error fetching users</div>;
  }
  return (
    <div className="w-full h-full overflow-y-scroll overflow-x-hidden py-4">
      <Typography className="p-2 border-b border-white-l/10 my-0 text-sm">
        All Friends- {data?.pages[0].total}
      </Typography>
      <List sx={{ width: "100%" }} className="p-0">
        {data?.pages.map((page, pageIndex) => {
          console.log(page);
          return (
            <Fragment key={pageIndex}>
              {page.friendList.map((user, i) => (
                <div
                  key={user.id}
                  className="hover:bg-dull-black/10 duration-75"
                >
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
                      <Tooltip title="chat">
                        <div className="more rounded-full w-11 h-11 group-hover:bg-dull-black/50 group-hover:text-light-blue duration-75 center">
                          <ChatBubbleIcon className="text-[17px]" />
                        </div>
                      </Tooltip>

                      <Tooltip title="more actions" >
                        <div className="more rounded-full w-11 h-11 group-hover:bg-dull-black/50 group-hover:text-light-blue duration-75 center">
                          <MoreVertIcon />
                        </div>
                      </Tooltip>
                    </div>
                  </ListItem>
                  {i !== page.friendList.length - 1 && (
                    <Divider
                      variant="inset"
                      component="div"
                      className="border-light-blue/10 w-full m-0"
                    />
                  )}
                </div>
              ))}
            </Fragment>
          );
        })}
      </List>

      {/* Trigger element for infinite scroll */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-1 w-full" />
      )}

      {/* Loading spinner when fetching next page */}
      {isFetchingNextPage && (
        <div className="text-center text-white">
          <Loading />
        </div>
      )}
    </div>
  );
};

export { Nav, AllUsers, AddFriend, AllFriends, Requests };
