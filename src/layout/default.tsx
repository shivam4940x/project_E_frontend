import { Tooltip } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";

const DefaulLayout = () => {
  const iconsClass = "text-white/50 text-2xl";
  const links = [
    {
      title: "Home",
      icon: <HomeIcon className={iconsClass} />,
      path: "/",
    },
    {
      title: "Chat",
      icon: <ChatIcon className={iconsClass} />,
      path: "/c/0",
    },
    {
      title: "settings",
      icon: <SettingsIcon className={iconsClass} />,
      path: "/settings",
    },
  ];
  return (
    <div className="flex h-screen max-h-screen overflow-hidden w-full relative">
      <div className="h-full pr-7 pl-6 py-12 border-r border-white-l/10 gap-12 flex items-center flex-col">
        {links.map((link) => (
          <Link to={link.path} className="inline-block" key={link.path}>
            <Tooltip title={link.title} className="w-max" placement="left">
              <div>{link.icon}</div>
            </Tooltip>
          </Link>
        ))}
      </div>
      <div className="grow w-full h-full max-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaulLayout;
