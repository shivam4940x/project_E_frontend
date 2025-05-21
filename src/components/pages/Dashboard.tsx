import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Loading from "../ui/Loading";
import { useUsers, useIntersectionObserver } from "@/hooks/useUsers";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { copyText } from "@/lib/other";
import GroupIcon from "@mui/icons-material/Groups";
import type { DashboardContent } from "@/types/SharedProps";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../utility/FormInput";
import { useFriend } from "@/hooks/useFriend";
import type { onGoingRequests } from "@/types/Response";
type NavProps = {
  setContent: Dispatch<SetStateAction<DashboardContent>>;
  currentContent: DashboardContent;
};

const Nav = ({ setContent, currentContent }: NavProps) => {
  const FriendsAction = [
    { title: "online", value: "online" },
    { title: "all", value: "all" },
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
                className="brightness-75 hover:brightness-100 duration-75 h-24"
              >
                <ListItem alignItems="center" className="mr-2">
                  <ListItemAvatar>
                    <Avatar alt={user.email} src={user.profile.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    className="text-white space-y-1"
                    primary={user.username}
                    secondary={
                      <Fragment>
                        <span className="flex">
                          <Typography
                            component="span"
                            variant="body2"
                            className="text-gray-400 text-xs"
                          >
                            {user.id}
                          </Typography>
                          <Button
                            component="span"
                            onClick={() => {
                              copyText(user.id);
                            }}
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

const OnlineFriends = () => {
  const { friendRequests, rejectFriend, acceptFriend } = useFriend();
  const [OnGoingRequests, setOnGoingRequests] = useState<
    onGoingRequests[] | []
  >([]);

  useEffect(() => {
    if (friendRequests) {
      setOnGoingRequests(friendRequests.onGoingRequests);
      console.log(friendRequests);
    }
  }, [friendRequests]);

  return (
    <div>
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
          {OnGoingRequests.length > 0 &&
            OnGoingRequests.map((request) => (
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
                      <Button
                        variant="text"
                        color="success"
                        size="small"
                        onClick={() => {
                          acceptFriend(request.addresseeId);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          rejectFriend(request.addresseeId);
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </ListItem>
              </div>
            ))}
        </List>
      </div>
    </div>
  );
};

const AllFriends = () => {
  return <div>al frinealkfj</div>;
};

export { Nav, AllUsers, AddFriend, AllFriends, OnlineFriends };
