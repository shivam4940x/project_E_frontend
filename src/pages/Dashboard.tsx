import {
  AddFriend,
  AllFriends,
  AllUsers,
  Nav,
  OnlineFriends,
} from "@/components/pages/Dashboard";
import type { DashboardContent } from "@/types/SharedProps";
import { useMemo, useState } from "react";

// pages/Dashboard.tsx
const Dashboard = () => {
  const [currentContent, setCurrentContent] =
    useState<DashboardContent>("add");

  const content = useMemo(
    () => ({
      add: <AddFriend />,
      all: <AllFriends />,
      online: <OnlineFriends />,
    }),
    []
  );
  return (
    <>
      <div className="w-full h-14 ">
        <nav className="w-full h-full">
          <Nav setContent={setCurrentContent} currentContent={currentContent} />
        </nav>
      </div>
      <div className="flex w-full h-[calc(100vh-56px)]">
        <main className="grow px-6 py-3">{content[currentContent]}</main>
        <div className="w-76 h-full overflow-hidden border-l border-light-blue/20">
          <AllUsers />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
