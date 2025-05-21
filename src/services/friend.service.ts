import type { AxiosResponse } from "axios";
import type { CurrentUser, FriendRequest, UserGetAll } from "@/types/Response";
import CreateCRUD from "./service";
import axiosInstance from "@/lib/plugins/axios";

// Instantiate CRUD with correct payload type
const friendServiceCrud = new CreateCRUD("/friend");

const FriendService = {
  getAll: (page = 1, limit = 10): Promise<AxiosResponse<UserGetAll>> => {
    return friendServiceCrud.getAll(page, limit);
  },

  get: (): Promise<AxiosResponse<CurrentUser>> => {
    return friendServiceCrud.get();
  },
  sendRequest: (id: string): Promise<AxiosResponse<CurrentUser>> => {
    return axiosInstance.post("/friend/request/send", {
      id,
    });
  },
  getRequests: (): Promise<AxiosResponse<FriendRequest>> => {
    return axiosInstance.get("/friend/requests");
  },
  accept: (id: string): Promise<AxiosResponse<FriendRequest>> => {
    return axiosInstance.put("/friend/request/accept", {
      id,
    });
  },
  reject: (id: string): Promise<AxiosResponse<FriendRequest>> => {
    return axiosInstance.put("/friend/request/reject", {
      id,
    });
  },
};

export default FriendService;
