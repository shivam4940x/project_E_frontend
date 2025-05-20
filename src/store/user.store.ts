import { create } from "zustand";
import UserService from "@/services/user.service"; // Ensure the correct import
import type { CurrentUser } from "@/types/Response";

interface UserStore {
  user: CurrentUser | null;
  isFetching: boolean; 
  getUser: () => Promise<CurrentUser | null>;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isFetching: false, 
  getUser: async () => {
    const { user, isFetching } = get();
    if (user && user.id) {
      return user;
    }
    if (isFetching) {
      return null;
    }
    set({ isFetching: true });
    try {
      const res = await UserService.get(); 
      set({ user: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    } finally {
      set({ isFetching: false }); 
    }
  },
}));

export default useUserStore;
