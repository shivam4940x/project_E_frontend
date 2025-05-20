import { Settings } from "@/components/layouts/default";
import useUserStore from "@/store/user.store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const DefaulLayout = () => {
  const { user, getUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      getUser(); // Zustand will update the state automatically
    }
  }, [user, getUser]);

  return (
    <div
      className="flex h-screen flex-col max-h-screen overflow-hidden w-full"
      style={{
        backgroundImage:
          "url(https://w.wallhaven.cc/full/2y/wallhaven-2yp6gg.png)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Simulates bg-black/70
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="flex grow">
        <div className="w-96 h-full flex flex-col justify-between">
          <div className="bg-deep-blue/50 grow"></div>
          <div className="h-16 w-full p-2">
            <Settings />
          </div>
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaulLayout;
