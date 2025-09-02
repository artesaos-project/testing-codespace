import { create } from "zustand";
import { UserProps, UserStore } from "@/types/UserProps";
import { persist } from "zustand/middleware";

const useStoreUser = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        userName: "",
        userPhoto: "",
        isAuthenticated: false,
        isModerator: false,
      },
      setUser: (user: UserProps) =>
        set(() => ({
          user: {
            userName: user.userName,
            userPhoto: user.userPhoto,
            isAuthenticated: true,
            isModerator: user.isModerator,
          },
        })),
      resetStore: () =>
        set(() => ({
          user: {
            userName: "",
            userPhoto: "",
            isAuthenticated: false,
            isModerator: false,
          },
        })),
    }),
    {
      name: "loginStore",
    }
  )
);

export default useStoreUser;
