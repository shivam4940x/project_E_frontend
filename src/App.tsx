import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "@/components/ui/Loading";
import DefaultLayout from "./layout/default";

// Lazy-loaded components
const Error404 = lazy(() => import("@/components/utility/404"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Chat = lazy(() => import("@/pages/Chat"));
const Login = lazy(() => import("@/pages/Login"));

const App = () => {
  // const pages = [];

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full center text-white bg-[#213448]">
          <Loading />
        </div>
      }
    >
      <Routes>
        {/* Routes that use the DefaultLayout */}
        <Route path="/" element={<DefaultLayout />}>
          {/* Index route (root path "/") */}
          <Route index element={<Dashboard />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>

        {/* Standalone routes */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default App;
