/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, List, ListItem } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/plugins/axios";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/ui/Loading";
import MenuIcon from "@mui/icons-material/Menu";
import { animate, createScope } from "animejs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  const root = useRef(null);
  const scope = useRef<any>(null);
  const [IsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const side_side_ani = ({
      dir,
      target,
      duration = 800,
    }: {
      dir: "in" | "out";
      target: string;
      duration: number;
    }) => {
      const move = dir === "in" ? "-100%" : "100%";
      animate(target, {
        x: move,
        duration,
        ease: "outQuint",
      });
    };

    scope.current = createScope({ root }).add((self) => {
      self.add("chat_toggle", side_side_ani);
    });

    return () => {
      if (scope.current) scope.current.revert();
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      return;
    }
    const animation = {
      dir: IsOpen ? "in" : "out",
      target: ".nigga",
      duration: 800,
    };
    scope.current?.methods.chat_toggle(animation);
  }, [IsOpen]);
  useEffect(() => {
    setIsOpen((pre) => !pre);
  }, [currentPath]);
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
    <div className="div" ref={root}>
      <div className="flex div lg:py-10 gap-12 max-w-full">
        <div className="flex flex-col lg:justify-between justify-end py-20 lg:py-4 h-full lg:sticky top-0 lg:min-w-max min-w-72 lg:mx-3 absolute right-0 translate-x-full lg:translate-x-0 z-10 backdrop-blur-lg nigga px-4">
          <List className="w-max overflow-hidden">
            {links.map((l) => {
              const isCurrentPath = currentPath == l.path;
              return (
                <ListItem
                  key={l.path}
                  className="px-0 lg:px-2 py-4 lg:py-2 w-full "
                >
                  <Link
                    to={l.path}
                    className={`p-3 w-full center border-soft-blue group ${
                      isCurrentPath ? "" : "brightness-75 hover:brightness-100"
                    }`}
                  >
                    <div className="h-full center -translate-x-30 group-hover:translate-x-0 duration-75">
                      <ArrowForwardIosIcon className="text-sm" />
                    </div>
                    <div className=" text-white-l/90 mx-2">{l.title}</div>
                    <div className="h-full center translate-x-30 group-hover:translate-x-0 duration-75">
                      <ArrowBackIosNewIcon className="text-sm" />
                    </div>
                  </Link>
                </ListItem>
              );
            })}
          </List>
          <Button
            onClick={logout}
            className={`py-3 w-full text-left brightness-75 hover:brightness-100 bg-soft-red/20 rounded-xl lg:mx-5`}
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
        <Button
          onClick={() => {
            setIsOpen((pre) => !pre);
          }}
          className="btn absolute top-5 right-8 rounded-full min-w-0 p-3 aspect-square bg-paper-black border border-white-l/20  z-20 lg:hidden"
        >
          <div className="div center">
            <MenuIcon className="text-2xl" />
          </div>
        </Button>
        <div className="grow overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayot;
