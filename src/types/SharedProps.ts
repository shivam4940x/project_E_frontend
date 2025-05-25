type DashboardContent = "requests" | "all" | "add";
type Message = {
  content: string;
  senderId: string;
  createdAt: string;
};
export type { DashboardContent, Message };
