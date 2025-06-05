import { Avatar, Tooltip } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import { useUsers } from "@/hooks/useUsers";

const Me = ({ className }: { className: string }) => {
  const { data: user } = useUsers().useCurrentUser();
  return (
    <div className={className}>
      <Avatar
        className="w-8 h-8"
        src={user?.profile.avatar}
        alt={user?.username}
      />
    </div>
  );
};
const DefaulLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const iconsClass = "text-white/50 text-2xl w-6 h-6";
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
      icon: <Me className={iconsClass} />,
      path: "/settings",
    },
  ];
  return (
    <div className="flex h-dvh max-h-screen overflow-hidden w-full relative flex-col-reverse lg:flex-row">
      <div className="lg:h-full lg:pr-7 lg:pl-6 lg:py-12 lg:border-r border-white-l/10 lg:gap-12 justify-around gap-4 pb-6 pt-4 border-t flex items-center lg:flex-col">
        {links.map((link) => (
          <Link
            to={link.path}
            className={`inline-block ${
              path === link.path ||
              (link.path === "/settings" && path.startsWith("/settings"))
                ? "scale-120 brightness-100"
                : "brightness-50"
            }`}
            key={link.path}
          >
            <Tooltip title={link.title} className="w-max" placement="left">
              <div>{link.icon}</div>
            </Tooltip>
          </Link>
        ))}
      </div>
      <div className="grow w-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaulLayout;
