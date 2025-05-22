// Requests.tsx
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, type FC } from "react";
import { timeAgo } from "@/lib/other";
import { useFriendRequest } from "@/hooks/useFriend";

import type { FriendRequestObj } from "@/types/Response";

type RequestType = "incoming" | "outgoing";

interface RequestSectionProps {
  title: string;
  type: RequestType;
  requests:
    | FriendRequestObj["onGoingRequests"]
    | FriendRequestObj["inComingRequests"];
}

const RequestSection: FC<RequestSectionProps> = ({ title, type, requests }) => {
  const { acceptFriend, rejectFriend, cancelFriend } = useFriendRequest();

  if (!requests || requests.length === 0) return null;

  return (
    <div className="space-y-4" id={`${type}_Requests`}>
      <Typography
        variant="h5"
        className="border-b border-white-l/10 py-2 h-12 flex items-end px-1"
      >
        <span>{title}</span>
      </Typography>
      <List className="bg-dull-black/20 rounded-xl p-0">
        {requests.map((req) => {
          const user =
            type === "outgoing"
              ? (req as FriendRequestObj["onGoingRequests"][number]).addressee
              : (req as FriendRequestObj["inComingRequests"][number]).requester;
          const userId =
            type === "outgoing"
              ? (req as FriendRequestObj["onGoingRequests"][number]).addresseeId
              : (req as FriendRequestObj["inComingRequests"][number])
                  .requesterId;

          return (
            <div
              key={req.id}
              className="hover:bg-dull-black/10 duration-100 h-20 w-full center border-b border-white-l/20 last:border-b-0"
            >
              <ListItem alignItems="center" className="mr-2">
                <div className="flex justify-between w-full items-center">
                  <div className="flex gap-2 items-center">
                    <ListItemAvatar className="center">
                      <Avatar alt={user.username} src={user.profile.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.username}
                      secondary={
                        <span className="text-sm text-gray-400/60 pl-1">
                          {timeAgo(req.updatedAt)}
                        </span>
                      }
                    />
                  </div>
                  <div className="space-x-5">
                    {type === "outgoing" ? (
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
                          onClick={() => cancelFriend(userId)}
                        >
                          <CloseIcon />
                        </Button>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Accept Request" arrow placement="top">
                          <Button
                            variant="text"
                            color="success"
                            size="small"
                            onClick={() => acceptFriend(userId)}
                          >
                            Accept
                          </Button>
                        </Tooltip>
                        <Tooltip title="Reject Request" arrow placement="top">
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => rejectFriend(userId)}
                          >
                            Decline
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              </ListItem>
            </div>
          );
        })}
      </List>
    </div>
  );
};

export default function Requests() {
  const { friendRequests } = useFriendRequest();
  const [Requests, setRequests] = useState<FriendRequestObj>({
    onGoingRequests: [],
    inComingRequests: [],
  });

  useEffect(() => {
    if (friendRequests) {
      setRequests(friendRequests);
    }
  }, [friendRequests]);

  return (
    <div>
      <RequestSection
        title="Outgoing requests"
        type="outgoing"
        requests={Requests.onGoingRequests}
      />
      <RequestSection
        title="Incoming requests"
        type="incoming"
        requests={Requests.inComingRequests}
      />
    </div>
  );
}
