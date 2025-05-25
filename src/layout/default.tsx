import { Chats, Settings } from "@/components/layouts/default";
import { Divider } from "@mui/material";
import { Outlet } from "react-router-dom";

const DefaulLayout = () => {
  return (
    <div
      className="flex h-screen flex-col max-h-screen overflow-hidden w-full "
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
      <div className="grow backdrop-blur-xs grid grid-cols-5 grid-rows-1">
        <div className="div flex flex-col justify-between border-r border-white-l/20">
          <div className="grow">
            <Chats />
          </div>
          <Divider
            flexItem
            orientation="horizontal"
            className="bg-white-l/10"
          />
          <div className="h-16 w-full p-2">
            <Settings />
          </div>
        </div>
        <div className="div col-span-4 max-h-screen  overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaulLayout;
