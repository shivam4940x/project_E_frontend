import type { AxiosResponse } from "axios";
import type {
  CurrentUser,
  FriendRequestObj,
  UserGetAll,
} from "@/types/Response";
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

  sendRequest: (id: string): Promise<AxiosResponse<{ message: string }>> => {
    return axiosInstance.post("/friend/request/send", {
      id,
    });
  },

  getRequests: (): Promise<AxiosResponse<FriendRequestObj>> => {
    return axiosInstance.get("/friend/requests");
  },

  cancel: (id: string): Promise<AxiosResponse<{ message: string }>> => {
    return axiosInstance.put("/friend/request/cancel", {
      id,
    });
  },

  accept: (id: string): Promise<AxiosResponse<{ message: string }>> => {
    return axiosInstance.put("/friend/request/accept", {
      id,
    });
  },

  reject: (id: string): Promise<AxiosResponse<{ message: string }>> => {
    return axiosInstance.put("/friend/request/reject", {
      id,
    });
  },
};

export default FriendService;
