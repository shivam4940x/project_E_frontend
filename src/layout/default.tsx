/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chats, Settings } from "@/components/layouts/default";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Divider,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useRef, useState } from "react";
import Requests from "@/components/pages/Dashboard/Requests";
import { AllFriends } from "@/components/pages/Dashboard/List";
import { animate, createScope } from "animejs";

const UserAvatar = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  return (
    <div>
      <Avatar src={src} alt={alt} className={className} />
    </div>
  );
};

const Friends = () => {
  return (
    <div className="p-2 space-y-3">
      <Requests />
      <AllFriends />
    </div>
  );
};
const Profile = () => {
  return <div>profile bitch</div>;
};
const DefaulLayout = () => {
  const root = useRef(null);
  const scope = useRef<any>(null);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [, setIsPageActie] = useState(false);
  const [activeComponent, setActiveComponent] = useState<
    "chat" | "friends" | "profile"
  >("chat");

  const togglePage = () => {
    setIsPageActie((pre) => {
      const dir = pre ? "right" : "left";
      if (pre) {
        navigate("/");
      }
      scope.current.methods.move_page({
        target: ".the_page",
        dir,
      });
      return !pre;
    });
  };
  const conponents = {
    chat: <Chats togglePage={togglePage} />,
    friends: <Friends />,
    profile: <Profile />,
  };

  useEffect(() => {
    const side_side_ani = ({
      dir,
      target,
      duration = 800,
    }: {
      dir: "left" | "right";
      target: string;
      duration: number;
    }) => {
      const move = dir === "left" ? "-100%" : "0%";
      animate(target, {
        x: move,
        duration,
        ease: "outQuint",
      });
    };

    scope.current = createScope({ root }).add((self) => {
      self.add("move_page", side_side_ani);
    });

    if (scope && scope.current) {
      return () => scope.current.revert();
    }
  }, []);

  return (
    <div
      ref={root}
      className="flex h-screen flex-col max-h-screen overflow-hidden w-full relative"
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
      <div className="grow backdrop-blur-xs lg:grid grid-cols-5 grid-rows-1 hidden">
        <div className="div flex flex-col justify-between border-r border-white-l/20">
          <div className="grow">
            <div className="">
              <Chats />
            </div>
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
        <div className="div col-span-4 max-h-screen overflow-x-hidden relative">
          <div className="absolute md:static div left-full top-0">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="lg:hidden flex flex-col div">
        <div className="grow">
          <div className="div relative">
            <div className="h-max">{conponents[activeComponent]}</div>
          </div>
        </div>
        <div className="h-max w-full ">
          <BottomNavigation
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
            className="h-16 bg-transparent"
          >
            <BottomNavigationAction
              label="Chat"
              icon={<ChatIcon className="w-5 h-5" />}
              sx={{
                color: "white", // default color
              }}
              onClick={() => {
                setActiveComponent("chat");
              }}
            />
            <BottomNavigationAction
              label="Friends"
              icon={<PeopleIcon className="w-5 h-5" />}
              sx={{
                color: "white",
              }}
              onClick={() => {
                setActiveComponent("friends");
              }}
            />
            <BottomNavigationAction
              label="Me"
              icon={<UserAvatar src="ola" alt="a" className="w-5 h-5" />}
              sx={{
                color: "white",
              }}
              onClick={() => {
                setActiveComponent("profile");
              }}
            />
          </BottomNavigation>
        </div>
      </div>

      <div className="top-0 left-full h-full w-full absolute bg-black the_page">
        <div className="h-10">
          <Button onClick={togglePage}>wanna go back?</Button>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaulLayout;
