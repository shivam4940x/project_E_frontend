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
export type { UserGetAll, CurrentUser };
