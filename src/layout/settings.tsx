import { Button, List, ListItem, Tooltip } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import axiosInstance from "@/lib/plugins/axios";
import { useState } from "react";
import Loading from "@/components/ui/Loading";
const SettingsLayot = () => {
  const location = useLocation();
  const links = [
    {
      title: "Edit profile",
      path: "/settings/profile",
    },
    {
      title: "Account managment",
      path: "/settings/account",
    },
    {
      title: "Privacy and data",
      path: "/settings/privacy",
    },
  ];
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);
  const currentPath = location.pathname;
  const logout = async () => {
    try {
      setIsloading(true);
      await axiosInstance.post("/auth/signout");

      // Clear tokens
      localStorage.removeItem("jwt");
      localStorage.removeItem("refresh_token");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="h-screen flex ">
      <div className="h-full px-5 py-12 border-r border-white-l/10">
        <Link to={"/"}>
          <Tooltip title="Home" className="w-max" placement="left">
            <div>
              <HomeIcon className="text-white/60 text-3xl" />
            </div>
          </Tooltip>
        </Link>
      </div>
      <div className="grid grid-cols-12 div grow px-8 py-10 gap-16 ">
        <div className="col-span-3 flex flex-col justify-between h-max sticky top-0">
          <List className="">
            {links.map((l) => {
              const isCurrentPath = currentPath == l.path;
              return (
                <ListItem key={l.path}>
                  <Link
                    to={l.path}
                    className={`p-3 w-full  border-soft-blue ${
                      isCurrentPath
                        ? "border-b"
                        : "brightness-75 hover:brightness-100"
                    }`}
                  >
                    <div className=" text-white-l/90">{l.title}</div>
                  </Link>
                </ListItem>
              );
            })}
          </List>
          <Button
            onClick={logout}
            className={`py-3 w-1/2 text-left brightness-75 hover:brightness-100 bg-soft-red/10 rounded-xl mx-5`}
          >
            {isloading ? (
              <div>
                <Loading />
              </div>
            ) : (
              <div className="text-soft-red">Logout</div>
            )}
          </Button>
        </div>

        <div className="col-span-9 div">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayot;
