import type { AxiosResponse } from "axios";
import axiosInstance from "../lib/plugins/axios";
import type { UserQuery } from "@/types/SharedProps";

class CreateCRUD {
  private path: string;

  constructor(baseUrl: string) {
    this.path = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  }

  private url(endpoint: string = ""): string {
    return this.path + endpoint;
  }

  async get(params?: UserQuery): Promise<AxiosResponse> {
    return axiosInstance.get(this.path, {
      params: { profile: params?.query.profile },
    });
  }
  async getById(id: string): Promise<AxiosResponse> {
    return axiosInstance.get(`${this.path}/${id}`);
  }

  async getAll(page = 1, limit = 5): Promise<AxiosResponse> {
    return axiosInstance.get(this.url("all"), { params: { page, limit } });
  }

  async delete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(this.url(id));
  }
}

export default CreateCRUD;
