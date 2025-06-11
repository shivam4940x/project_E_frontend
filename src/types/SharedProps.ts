type DashboardContent = "requests" | "all" | "add";
type Message = {
  id: string;
  content: string;
  senderId: string;
  iv: string;
  createdAt: string;
};
type UserQuery = {
  query: {
    profile?: boolean;
    account?: boolean;
  };
};
export type { DashboardContent, Message, UserQuery };
