import { Button, List, ListItem } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
      <div className="flex div grow px-2 py-10 gap-12 max-w-full">
        <div className="col-span-3 flex flex-col justify-between h-full sticky top-0 min-w-max mx-3">
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
            className={`py-3 w-full text-left brightness-75 hover:brightness-100 bg-soft-red/10 rounded-xl mx-5`}
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

        <div className="col-span-9 div grow min-w-min">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayot;
