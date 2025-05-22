import { AddFriend, Nav } from "@/components/pages/Dashboard/Index";
import { AllFriends, AllUsers } from "@/components/pages/Dashboard/lists";
import Requests from "@/components/pages/Dashboard/Requests";
import type { DashboardContent } from "@/types/SharedProps";
import { useMemo, useState } from "react";

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
  return (
    <>
      <div className="w-full h-14 ">
        <nav className="div">
          <Nav setContent={setCurrentContent} currentContent={currentContent} />
        </nav>
      </div>
      <div className="flex w-full h-[calc(100vh-56px)]">
        <main className="grow px-4 py-2 max-h-full overflow-scroll">
          {content[currentContent]}
        </main>
        <div className="w-76 h-full overflow-hidden border-l border-light-blue/20">
          <AllUsers />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
