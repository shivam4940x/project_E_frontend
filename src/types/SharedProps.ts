type DashboardContent = "requests" | "all" | "add";
type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};
type UserQuery = {
  query: {
    profile: boolean;
  };
}
export type { DashboardContent, Message, UserQuery };
