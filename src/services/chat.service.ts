import type { AxiosResponse } from "axios";
import type { MessageAll } from "@/types/Response";
import axiosInstance from "@/lib/plugins/axios";

const ChatService = {
  getAll: (
    page = 1,
    limit = 50,
    conversationId: string
  ): Promise<AxiosResponse<MessageAll>> => {
    return axiosInstance.get("/chat/all", {
      params: {
        page,
        limit,
        conversationId,
      },
    });
  },
};

export default ChatService;
