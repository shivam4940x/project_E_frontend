import Requests from "@/components/pages/Dashboard/Requests";
import { AddFriend, Nav } from "@/components/pages/Dashboard/Index";
import { AllFriends, AllUsers } from "@/components/pages/Dashboard/List";
import { useMemo, useState } from "react";
//types
import type { DashboardContent } from "@/types/SharedProps";

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
    <div className="div flex flex-col">
      <div className="w-full h-18">
        <nav className="div">
          <Nav setContent={setCurrentContent} currentContent={currentContent} />
        </nav>
      </div>
      <div className="flex w-full grow">
        <main className="grow px-2 py-2 max-h-full">
          {content[currentContent]}
        </main>
        <div className="w-96 h-full overflow-hidden border-l border-light-blue/20 hidden lg:block">
          <AllUsers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
