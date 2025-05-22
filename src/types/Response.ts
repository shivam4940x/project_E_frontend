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


type FriendRequestObj = {
  onGoingRequests: {
    id: string;
    addresseeId: string;
    updatedAt: string;
    addressee: {
      username: string;
      profile: {
        avatar: string;
      };
    };
  }[];
  inComingRequests: {
    id: string;
    requesterId: string;
    updatedAt: string;
    requester: {
      username: string;
      profile: {
        avatar: string;
      };
    };
  }[];
};
type FriendsAll = {
  friendList: {
    id: string;
    username: string;
    profile: {
      avatar: string;
    };
    updatedAt: string;
  }[];
  total: number;
  page: number;
  lastPage: number;
};
export type { UserGetAll, CurrentUser, FriendRequestObj, FriendsAll };
