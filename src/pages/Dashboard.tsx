/* eslint-disable @typescript-eslint/no-explicit-any */
import Requests from "@/components/pages/Dashboard/Requests";
import { AddFriend, Nav } from "@/components/pages/Dashboard/Index";
import { AllFriends, AllUsers } from "@/components/pages/Dashboard/List";
import { useEffect, useMemo, useRef, useState } from "react";
//types
import type { DashboardContent } from "@/types/SharedProps";
import { Button } from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { animate, createScope } from "animejs";

// pages/Dashboard.tsx
const Dashboard = () => {
  const [currentContent, setCurrentContent] = useState<DashboardContent>("all");

  const content = useMemo(
    () => ({
      all: <AllFriends />,
      add: <AddFriend />,
      requests: <Requests />,
    }),
    []
  );
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
      target: ".allUsers",
      duration: 800,
    };
    scope.current?.methods.chat_toggle(animation);
  }, [IsOpen]);

  return (
    <div className="div flex flex-col" ref={root}>
      <div className="w-full h-18">
        <nav className="div">
          <Nav setContent={setCurrentContent} currentContent={currentContent} />
        </nav>
      </div>
      <div className="flex w-full grow">
        <main className="grow px-2 py-2 max-h-full">
          {content[currentContent]}
        </main>
        <Button
          onClick={() => {
            setIsOpen((pre) => !pre);
          }}
          className="btn absolute bottom-20 right-6 rounded-full min-w-0 p-3 aspect-square bg-paper-black border border-white-l/20  z-20 lg:hidden"
        >
          <div className="div center">
            <Diversity3Icon />
          </div>
        </Button>
        <div className="lg:w-96 w-full h-full overflow-hidden border-l border-light-blue/20 lg:block allUsers absolute right-0 top-0 translate-x-full lg:translate-x-0 z-10 backdrop-blur-lg nigga px-4">
          <AllUsers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
