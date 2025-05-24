type DashboardContent = "requests" | "all" | "add";
type Message = {
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  sendAt: string;
};
export type { DashboardContent, Message };
