import axiosInstance from "@/lib/plugins/axios";
import type { AxiosResponse } from "axios";

const ChatService = {
  getChat: (page = 1, limit = 10): Promise<AxiosResponse> => {
    return axiosInstance.get("/all", {
      params: {
        page,
        limit,
      },
    });
  },
};

export default ChatService;
