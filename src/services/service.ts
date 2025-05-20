import type { AxiosResponse } from "axios";
import axiosInstance from "../lib/plugins/axios";

class CreateCRUD {
  private path: string;

  constructor(baseUrl: string) {
    this.path = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  }

  private url(endpoint: string = ""): string {
    return this.path + endpoint;
  }

  async get(): Promise<AxiosResponse> {
    return axiosInstance.get(this.path);
  }

  async getAll(page = 1, limit = 5): Promise<AxiosResponse> {
    return axiosInstance.get(this.url("all"), { params: { page, limit } });
  }

  async delete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(this.url(id));
  }
}

export default CreateCRUD;
