import type { AxiosResponse } from "axios";
import CreateCRUD from "./service";
import type { UserObj, UserGetAll } from "@/types/Response";
import type { UserQuery } from "@/types/SharedProps";
import axiosInstance from "@/lib/plugins/axios";
import type { UserPayload, UserPayloadAccount } from "@/types/Form";
// Instantiate CRUD with correct payload type
const UserServiceCrud = new CreateCRUD("/user");

const UserService = {
  getAll: (page = 1, limit = 5): Promise<AxiosResponse<UserGetAll>> => {
    return UserServiceCrud.getAll(page, limit);
  },

  get: (params?: string | UserQuery): Promise<AxiosResponse<UserObj>> => {
    if (typeof params === "string") {
      return UserServiceCrud.getById(params);
    } else if (params) {
      return axiosInstance.get("/user", {
        params: {
          profile: params?.query.profile,
          account: params?.query.account,
        },
      });
    } else {
      return UserServiceCrud.get();
    }
  },
  update: (
    payload: UserPayload | UserPayloadAccount
  ): Promise<AxiosResponse> => {
    return axiosInstance.post("/user", payload);
  },
};

export default UserService;
