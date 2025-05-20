import type { AxiosResponse } from "axios";
import CreateCRUD from "./service";
import type { CurrentUser, UserGetAll } from "@/types/Response";



// Instantiate CRUD with correct payload type
const UserServiceCrud = new CreateCRUD("/user");

const UserService = {
  getAll: (page = 1, limit = 5): Promise<AxiosResponse<UserGetAll>> => {
    return UserServiceCrud.getAll(page, limit);
  },

  get: (): Promise<AxiosResponse<CurrentUser>> => {
    return UserServiceCrud.get();
  },

};

export default UserService;
