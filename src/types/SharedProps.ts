type DashboardContent = "requests" | "all" | "add";
type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export type { DashboardContent, Message };
