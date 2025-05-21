type UserGetAll = {
  users: {
    id: string;
    username: string;
    email: string;
    profile: {
      avatar?: string;
    };
  }[];
  total: number;
  page: number;
  lastPage: number;
};
type CurrentUser = {
  id: string;
  username: string;
  profile: { avatar: string };
};
// inComingRequests:
type onGoingRequests = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED"; // Extend as needed
  createdAt: string; // ISO string; you can use `Date` if parsed
  updatedAt: string;
  addressee: {
    id: string;
    username: string;
    email: string;
    profile: {
      avatar: string;
    };
  };
};
type FriendRequest = {
  onGoingRequests: onGoingRequests[];
};

export type { UserGetAll, CurrentUser, FriendRequest, onGoingRequests };
