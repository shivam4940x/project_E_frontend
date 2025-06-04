import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "@/components/ui/Loading";
import DefaultLayout from "./layout/default";
import SettingsLayot from "./layout/settings";
import Profile from "./pages/settings/Profile";
import Account from "./pages/settings/Account";
import Privacy from "./pages/settings/Privacy";

// Lazy-loaded components
const Error404 = lazy(() => import("@/components/util/404"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Chat = lazy(() => import("@/pages/Chat"));
const Login = lazy(() => import("@/pages/Login"));

const App = () => {
  const settings = [
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "account",
      element: <Account />,
    },
    {
      path: "privacy",
      element: <Privacy />,
    },
  ];
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full center text-white bg-dull-black/10">
          <Loading />
        </div>
      }
    >
      <Routes>
        {/* Routes that use the DefaultLayout */}
        <Route path="/" element={<DefaultLayout />}>
          {/* Index route (root path "/") */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/c/:conversationId" element={<Chat />} />
          <Route path="/settings" element={<SettingsLayot />}>
            {settings.map((s) => (
              <Route path={`/settings/${s.path}`} element={s.element} />
            ))}
          </Route>
        </Route>

        {/* Standalone routes */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default App;
