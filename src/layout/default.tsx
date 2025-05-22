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
      <div className="flex grow backdrop-blur-xs">
        <div className="w-sm h-full flex flex-col justify-between ">
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
        <Divider flexItem orientation="vertical" className="bg-white-l/10" />
        <div className="div">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaulLayout;
