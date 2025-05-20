import type { AxiosResponse } from "axios";
import type { CurrentUser, UserGetAll } from "@/types/Response";
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
  add: (id: string): Promise<AxiosResponse<CurrentUser>> => {
    return axiosInstance.post("/friend/add", {
      id,
    });
  },
};

export default FriendService;
